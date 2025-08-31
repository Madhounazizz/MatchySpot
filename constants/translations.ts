export const translations = {
  en: {
    // Navigation
    discover: 'Discover',
    map: 'Map',
    chat: 'Chat',
    profile: 'Profile',
    restaurants: 'Restaurants',
    cafes: 'Cafes',
    bars: 'Bars',
    
    // Common
    verify: 'Verify',
    verified: 'Verified',
    open: 'Open',
    closed: 'Closed',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    
    // BRC Card
    viewMenu: 'View Menu',
    bookTable: 'Book Table',
    joinChatroom: 'Join Chatroom',
    distance: 'distance',
    rating: 'rating',
    reviews: 'reviews',
    
    // Discover
    noMoreMatches: 'No more matches today!',
    checkBackLater: 'Check back later for new people',
    refresh: 'Refresh',
    like: 'Like',
    skip: 'Skip',
    suggestedMeetup: 'Suggested Meetup',
    match: 'Match',
    
    // Categories
    all: 'All',
    restaurant: 'Restaurant',
    cafe: 'Cafe',
    bar: 'Bar',
    fastFood: 'Fast Food',
    fineDining: 'Fine Dining',
    casual: 'Casual',
    
    // Sections
    featured: 'Featured',
    nearbyPlaces: 'Nearby Places',
    popularNow: 'Popular Now',
    newPlaces: 'New Places',
    
    // Settings
    language: 'Language',
    english: 'English',
    french: 'Français',
    changeLanguage: 'Change Language',
    
    // Verification
    verificationPending: 'Verification Pending',
    verificationApproved: 'Verified Business',
    verificationRejected: 'Verification Failed',
    requestVerification: 'Request Verification',
    verificationInProgress: 'Verifying...',
    verificationSuccess: 'Verification successful!',
    verificationError: 'Verification failed. Please try again.',
    
    // Profile & Auth
    logout: 'Log Out',
    myWallet: 'My Wallet',
    myReviews: 'My Reviews',
    myEvents: 'My Events',
    inviteFriends: 'Invite Friends',
    restaurantDashboard: 'Restaurant Dashboard',
  },
  fr: {
    // Navigation
    discover: 'Découvrir',
    map: 'Carte',
    chat: 'Chat',
    profile: 'Profil',
    restaurants: 'Restaurants',
    cafes: 'Cafés',
    bars: 'Bars',
    
    // Common
    verify: 'Vérifier',
    verified: 'Vérifié',
    open: 'Ouvert',
    closed: 'Fermé',
    loading: 'Chargement...',
    error: 'Erreur',
    retry: 'Réessayer',
    cancel: 'Annuler',
    save: 'Enregistrer',
    edit: 'Modifier',
    delete: 'Supprimer',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    
    // BRC Card
    viewMenu: 'Voir le Menu',
    bookTable: 'Réserver une Table',
    joinChatroom: 'Rejoindre le Chat',
    distance: 'distance',
    rating: 'note',
    reviews: 'avis',
    
    // Discover
    noMoreMatches: 'Plus de correspondances aujourd\'hui !',
    checkBackLater: 'Revenez plus tard pour de nouvelles personnes',
    refresh: 'Actualiser',
    like: 'J\'aime',
    skip: 'Passer',
    suggestedMeetup: 'Rencontre Suggérée',
    match: 'Correspondance',
    
    // Categories
    all: 'Tous',
    restaurant: 'Restaurant',
    cafe: 'Café',
    bar: 'Bar',
    fastFood: 'Restauration Rapide',
    fineDining: 'Haute Gastronomie',
    casual: 'Décontracté',
    
    // Sections
    featured: 'En Vedette',
    nearbyPlaces: 'Lieux à Proximité',
    popularNow: 'Populaire Maintenant',
    newPlaces: 'Nouveaux Lieux',
    
    // Settings
    language: 'Langue',
    english: 'English',
    french: 'Français',
    changeLanguage: 'Changer de Langue',
    
    // Verification
    verificationPending: 'Vérification en Attente',
    verificationApproved: 'Entreprise Vérifiée',
    verificationRejected: 'Vérification Échouée',
    requestVerification: 'Demander la Vérification',
    verificationInProgress: 'Vérification...',
    verificationSuccess: 'Vérification réussie !',
    verificationError: 'Vérification échouée. Veuillez réessayer.',
    
    // Profile & Auth
    logout: 'Se Déconnecter',
    myWallet: 'Mon Portefeuille',
    myReviews: 'Mes Avis',
    myEvents: 'Mes Événements',
    inviteFriends: 'Inviter des Amis',
    restaurantDashboard: 'Tableau de Bord Restaurant',
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;