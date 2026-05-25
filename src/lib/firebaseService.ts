import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth, storage, OperationType, handleFirestoreError } from './firebase';
import { Listing, User, Conversation, ChatMessage } from '../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * NOTE ON FIREBASE STORAGE SECURITY RULES:
 * To make uploaded listing images publicly accessible across all devices,
 * make sure the following security rules are applied in your Firebase Console
 * under Storage > Rules:
 *
 * rules_version = '2';
 * service firebase.storage {
 *   match /b/{bucket}/o {
 *     match /listings/{listingId}/{imageFile} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *     match /listing_images/{imageFile} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 */

/**
 * Upload compressed image to Firebase Storage, returning the download URL.
 * Falls back to base64 string if Firebase Storage fails or is not enabled.
 */
export async function uploadListingImage(base64DataUrl: string): Promise<string> {
  try {
    const arr = base64DataUrl.split(',');
    if (arr.length < 2) return base64DataUrl;
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });

    const filename = `listing_images/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.jpg`;
    const storageRef = ref(storage, filename);
    const snapshot = await uploadBytes(storageRef, blob, { contentType: mime });
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.warn('Firebase Storage upload failed: falling back to base64 representation.', error);
    return base64DataUrl;
  }
}

/**
 * Validates connection to Firestore as required by the SKILL.md.
 */
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// ----------------- USER PROFILE SERVICES -----------------

export async function saveUserProfile(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      location: user.location,
      joinDate: user.joinDate || '2026',
      isVerified: user.isVerified || false,
      rating: user.rating || 5,
      listingsCount: user.listingsCount || 0,
      responseTime: user.responseTime || '100% inside 5 mins',
      phone: user.phone || '',
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const path = `users/${userId}`;
  try {
    const docRef = await getDoc(doc(db, 'users', userId));
    if (docRef.exists()) {
      return docRef.data() as User;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

// ----------------- LISTINGS SERVICES -----------------

export async function createFirestoreListing(listing: Listing): Promise<void> {
  const path = `listings/${listing.id}`;
  try {
    const docData: any = {
      id: listing.id,
      title: listing.title,
      titleDari: listing.titleDari || listing.title,
      titlePashto: listing.titlePashto || listing.title,
      price: listing.price,
      currency: listing.currency,
      priceType: listing.priceType || 'negotiable',
      category: listing.category,
      images: listing.images && listing.images.length > 0 ? listing.images : [],
      description: listing.description || '',
      descriptionDari: listing.descriptionDari || listing.description || '',
      descriptionPashto: listing.descriptionPashto || listing.description || '',
      location: listing.location,
      locationDari: listing.locationDari || listing.location,
      locationPashto: listing.locationPashto || listing.location,
      province: listing.province,
      postedTime: listing.postedTime,
      sellerId: listing.seller.id,
      seller: {
        id: listing.seller.id,
        name: listing.seller.name,
        avatar: listing.seller.avatar,
        location: listing.seller.location || '',
        isVerified: listing.seller.isVerified || false,
        rating: listing.seller.rating || 5,
        phone: listing.seller.phone || '',
      },
      isVerified: listing.isVerified || false,
      views: listing.views || 0,
      condition: listing.condition || 'new',
      createdAt: serverTimestamp(),
    };

    if (listing.subcategory) docData.subcategory = listing.subcategory;
    if (listing.handDrive) docData.handDrive = listing.handDrive;
    if (listing.carpetStyle) docData.carpetStyle = listing.carpetStyle;
    if (listing.specs) docData.specs = listing.specs;

    await setDoc(doc(db, 'listings', listing.id), docData);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateFirestoreListing(listingId: string, updates: Partial<Listing>): Promise<void> {
  const path = `listings/${listingId}`;
  try {
    const docRef = doc(db, 'listings', listingId);
    await updateDoc(docRef, updates as any);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteFirestoreListing(listingId: string): Promise<void> {
  const path = `listings/${listingId}`;
  try {
    await deleteDoc(doc(db, 'listings', listingId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function subscribeToListings(onUpdate: (listings: Listing[]) => void, onError: (err: any) => void) {
  const colRef = collection(db, 'listings');
  // Order list is complex unless indexed; simple listener acts best in development
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Listing[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        items.push({
          id: d.id,
          title: d.title,
          titleDari: d.titleDari || d.title,
          titlePashto: d.titlePashto || d.title,
          price: d.price,
          currency: d.currency,
          priceType: d.priceType || 'negotiable',
          category: d.category,
          images: d.images,
          description: d.description,
          descriptionDari: d.descriptionDari || d.description || '',
          descriptionPashto: d.descriptionPashto || d.description || '',
          location: d.location,
          locationDari: d.locationDari || d.location || '',
          locationPashto: d.locationPashto || d.location || '',
          province: d.province,
          postedTime: d.postedTime,
          seller: {
            id: d.sellerId,
            name: d.seller?.name || 'Seller',
            avatar: d.seller?.avatar || '',
            location: d.seller?.location || '',
            joinDate: d.seller?.joinDate || '2026',
            isVerified: d.seller?.isVerified || false,
            rating: d.seller?.rating || 5,
            listingsCount: d.seller?.listingsCount || 0,
            responseTime: d.seller?.responseTime || '',
            phone: d.seller?.phone || '',
          },
          isVerified: d.isVerified || false,
          views: d.views || 0,
          condition: d.condition || 'new',
          subcategory: d.subcategory,
          handDrive: d.handDrive,
          carpetStyle: d.carpetStyle,
          specs: d.specs,
        });
      });
      onUpdate(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'listings');
      onError(err);
    }
  );
}

// ----------------- FAVORITES SERVICES -----------------

export async function saveFavorite(userId: string, listingId: string): Promise<void> {
  const path = `users/${userId}/favorites/${listingId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'favorites', listingId), {
      listingId,
      savedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function removeFavorite(userId: string, listingId: string): Promise<void> {
  const path = `users/${userId}/favorites/${listingId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'favorites', listingId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function subscribeToFavorites(userId: string, onUpdate: (favs: string[]) => void) {
  const path = `users/${userId}/favorites`;
  return onSnapshot(
    collection(db, 'users', userId, 'favorites'),
    (snapshot) => {
      const keys: string[] = [];
      snapshot.forEach((doc) => {
        keys.push(doc.id);
      });
      onUpdate(keys);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

// ----------------- REAL-TIME CHAT / CONVERSATIONS -----------------

export function subscribeToConversations(userId: string, onUpdate: (conversations: Conversation[]) => void) {
  const colRef = collection(db, 'conversations');
  const q = query(colRef, where('participantIds', 'array-contains', userId));

  return onSnapshot(
    q,
    async (snapshot) => {
      const convs: Conversation[] = [];
      
      for (const d of snapshot.docs) {
        const data = d.data();
        
        // Fetch subcollection messages for this conversation as well
        const messagesQuery = query(
          collection(db, 'conversations', d.id, 'messages'),
          orderBy('createdAt', 'asc')
        );

        let msgs: ChatMessage[] = [];
        try {
          const msgSnap = await getDocs(messagesQuery);
          msgSnap.forEach((m) => {
            const mData = m.data();
            msgs.push({
              id: mData.id,
              senderId: mData.senderId,
              text: mData.text,
              timestamp: mData.timestamp,
              status: mData.status || 'sent',
            });
          });
        } catch (e) {
          console.error(`Error reading messages subcollection for conversation ${d.id}`, e);
        }

        convs.push({
          id: data.id,
          user: {
            name: data.user?.name || 'User',
            avatar: data.user?.avatar || '',
            isOnline: data.user?.isOnline ?? false,
          },
          lastMessage: data.lastMessage || '',
          lastMessageTime: data.lastMessageTime || '',
          unreadCount: data.unreadCount || 0,
          listingContext: data.listingContext,
          messages: msgs,
        });
      }
      onUpdate(convs);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'conversations');
    }
  );
}

export async function createConversation(conversation: Conversation, userId: string): Promise<void> {
  const path = `conversations/${conversation.id}`;
  const otherParticipant = conversation.user.name;
  const participantIds = [userId, `peer_${otherParticipant.toLowerCase().replace(/\s+/g, '_')}`];
  
  try {
    await setDoc(doc(db, 'conversations', conversation.id), {
      id: conversation.id,
      participantIds,
      user: {
        name: conversation.user.name,
        avatar: conversation.user.avatar,
        isOnline: conversation.user.isOnline,
      },
      lastMessage: conversation.lastMessage,
      lastMessageTime: conversation.lastMessageTime,
      unreadCount: conversation.unreadCount,
      listingContext: conversation.listingContext || null,
      updatedAt: serverTimestamp(),
    });

    // Write initial message to messages subcollection
    if (conversation.messages && conversation.messages.length > 0) {
      const firstMsg = conversation.messages[0];
      await setDoc(doc(db, 'conversations', conversation.id, 'messages', firstMsg.id), {
        id: firstMsg.id,
        senderId: userId,
        text: firstMsg.text,
        timestamp: firstMsg.timestamp,
        status: firstMsg.status || 'sent',
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function sendChatMessage(conversationId: string, message: ChatMessage, parentConv: Conversation): Promise<void> {
  const msgPath = `conversations/${conversationId}/messages/${message.id}`;
  const convPath = `conversations/${conversationId}`;
  try {
    // 1. Write the message
    await setDoc(doc(db, 'conversations', conversationId, 'messages', message.id), {
      id: message.id,
      senderId: message.senderId,
      text: message.text,
      timestamp: message.timestamp,
      status: message.status || 'sent',
      createdAt: serverTimestamp(),
    });

    // 2. Update parent conversation metadata
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: message.text,
      lastMessageTime: message.timestamp,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, msgPath);
  }
}

export async function clearAllListingsFromFirestore(): Promise<void> {
  try {
    const colRef = collection(db, 'listings');
    const snap = await getDocs(colRef);
    const deletePromises = snap.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (err) {
    console.error('Error clearing listings from Firestore:', err);
    throw err;
  }
}

export async function clearAllConversationsFromFirestore(): Promise<void> {
  try {
    const colRef = collection(db, 'conversations');
    const snap = await getDocs(colRef);
    for (const d of snap.docs) {
      const msgsCol = collection(db, 'conversations', d.id, 'messages');
      const msgsSnap = await getDocs(msgsCol);
      const deleteMsgsPromises = msgsSnap.docs.map((mDoc) => deleteDoc(mDoc.ref));
      await Promise.all(deleteMsgsPromises);
      await deleteDoc(d.ref);
    }
  } catch (err) {
    console.error('Error clearing conversations from Firestore:', err);
    throw err;
  }
}

