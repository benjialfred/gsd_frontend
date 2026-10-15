import React, { useState, useMemo } from 'react';
import { 
  Smile, Heart, Dog, Utensils, Trophy, Lamp, Flag, 
  Search, X, Church, User, History
} from 'lucide-react';

interface WhatsAppEmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose?: () => void;
}

interface EmojiCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  emojis: { char: string; keywords: string }[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    name: 'Smileys & Émotions',
    icon: <Smile size={18} />,
    emojis: [
      { char: '😀', keywords: 'sourire content rire smile' },
      { char: '😃', keywords: 'sourire joie rire heureux' },
      { char: '😄', keywords: 'rire joie visage smile' },
      { char: '😁', keywords: 'rayonner sourire dents' },
      { char: '😆', keywords: 'rire yeux fermés mdr' },
      { char: '😅', keywords: 'sueur soulagement rire' },
      { char: '😂', keywords: 'pleurer de rire larmes mdr lol' },
      { char: '🤣', keywords: 'mort de rire ptdr rouler terre' },
      { char: '🥲', keywords: 'sourire larme ému reconnaissant' },
      { char: '🥹', keywords: 'yeux larmoyants ému tendresse' },
      { char: '😊', keywords: 'timide doux sourire joue rouge' },
      { char: '😇', keywords: 'ange halo saint pur bienveillant' },
      { char: '🙂', keywords: 'doux sourire calme' },
      { char: '🙃', keywords: 'renversé humour taquin' },
      { char: '😉', keywords: 'clin oeil complice taquin' },
      { char: '😌', keywords: 'soulagé paix serein zen' },
      { char: '😍', keywords: 'yeux coeur amour adore fan' },
      { char: '🥰', keywords: 'amoureux tendresse comblé coeurs' },
      { char: '😘', keywords: 'bisou coeur envoyer baiser kiss' },
      { char: '😗', keywords: 'bisou sifflement kiss' },
      { char: '😚', keywords: 'bisou yeux fermés tendresse' },
      { char: '😙', keywords: 'bisou sourire doux' },
      { char: '😋', keywords: 'miam gourmand langue délice' },
      { char: '😛', keywords: 'langue tirée jeu' },
      { char: '😜', keywords: 'clin oeil langue rigolade' },
      { char: '🤪', keywords: 'fou folie grimace rigolo' },
      { char: '😝', keywords: 'yeux fermés langue rire' },
      { char: '🤑', keywords: 'argent riche sous' },
      { char: '🤗', keywords: 'calin bras ouverts accueil tendresse' },
      { char: '🤭', keywords: 'main bouche surprise discret rire' },
      { char: '🤫', keywords: 'silence chut secret discret' },
      { char: '🤔', keywords: 'penser réflexion douter question' },
      { char: '🫡', keywords: 'salut respect militaire obéir' },
      { char: '🤐', keywords: 'bouche cousue motus secret' },
      { char: '🤨', keywords: 'sourcil levé sceptique doute' },
      { char: '😐', keywords: 'neutre sans expression' },
      { char: '😑', keywords: 'blasé sans commentaire' },
      { char: '😶', keywords: 'sans voix muet' },
      { char: '😏', keywords: 'sourire en coin malicieux charme' },
      { char: '😒', keywords: 'déçu pas amusé dubitatif' },
      { char: '🙄', keywords: 'yeux au ciel exaspéré' },
      { char: '😬', keywords: 'gêné crispé oups' },
      { char: '🤥', keywords: 'menteur nez pinocchio' },
      { char: '😌', keywords: 'sérénité repos paix' },
      { char: '😔', keywords: 'triste pensif mélancolie' },
      { char: '😪', keywords: 'fatigué goutte sommeil' },
      { char: '🤤', keywords: 'bave envie gourmandise' },
      { char: '😴', keywords: 'dort sommeil nuit repos zzz' },
      { char: '😷', keywords: 'masque malade santé' },
      { char: '🤒', keywords: 'fièvre thermomètre malade' },
      { char: '🤕', keywords: 'blessé bandage pansement' },
      { char: '🤢', keywords: 'nausée vert dégoût' },
      { char: '🤮', keywords: 'vomi écoeuré' },
      { char: '🤧', keywords: 'éternue mouchoir rhume' },
      { char: '🥵', keywords: 'chaud chaleur transpire rouge' },
      { char: '🥶', keywords: 'froid gelé bleu glaçon' },
      { char: '🥴', keywords: 'tournis ivre confus bizarre' },
      { char: '😵', keywords: 'vertige sonné étourdi' },
      { char: '🤯', keywords: 'cerveau explose choc incroyable wow' },
      { char: '🤠', keywords: 'cowboy chapeau fête' },
      { char: '🥳', keywords: 'fête cotillon anniversaire joie' },
      { char: '🥸', keywords: 'déguisé lunettes moustache' },
      { char: '😎', keywords: 'cool lunettes de soleil classe stylé' },
      { char: '🤓', keywords: 'geek intello lunettes étude' },
      { char: '🧐', keywords: 'monocle analyse inspecter curieux' },
      { char: '😕', keywords: 'confus perplexe' },
      { char: '😟', keywords: 'inquiet soucieux' },
      { char: '🙁', keywords: 'triste moue' },
      { char: '😮', keywords: 'bouche bée surprise oh' },
      { char: '😯', keywords: 'surpris stupéfait' },
      { char: '😲', keywords: 'étonné choqué stupéfait' },
      { char: '😳', keywords: 'gêné rouge timide yeux écarquillés' },
      { char: '🥺', keywords: 'supplication s\'il te plait doux ému' },
      { char: '😦', keywords: 'bouche ouverte déception' },
      { char: '😧', keywords: 'angoissé inquiet' },
      { char: '😨', keywords: 'peur effrayé' },
      { char: '😰', keywords: 'angoisse sueur froide panique' },
      { char: '😥', keywords: 'soulagement triste ouf' },
      { char: '😢', keywords: 'larme tristesse pleur ému' },
      { char: '😭', keywords: 'pleurs torrent larmes tristesse' },
      { char: '😱', keywords: 'cri effroi terreur choc' },
      { char: '😖', keywords: 'frustré énervé' },
      { char: '😣', keywords: 'lutte effort persévérance' },
      { char: '😞', keywords: 'déçu peine chagrin' },
      { char: '😓', keywords: 'sueur peine fatigue' },
      { char: '😩', keywords: 'épuisé lasse ras le bol' },
      { char: '😫', keywords: 'fatigue extrême gémissement' },
      { char: '🥱', keywords: 'bâillement sommeil ennui' },
      { char: '😤', keywords: 'triomphe fumée nez détermination' },
      { char: '😡', keywords: 'en colère fâché rouge' },
      { char: '😠', keywords: 'mécontent fâché' },
      { char: '🤬', keywords: 'insulte juron énervé' },
      { char: '😈', keywords: 'diable sourire malin' },
      { char: '👿', keywords: 'diable colère méchant' },
      { char: '💀', keywords: 'mort crâne squelette mort de rire' },
      { char: '💩', keywords: 'caca rigolo' },
      { char: '🤡', keywords: 'clown farce' },
      { char: '👻', keywords: 'fantôme effrayant rigolo' },
      { char: '👽', keywords: 'extraterrestre alien' },
      { char: '🤖', keywords: 'robot intelligence mécanique' }
    ]
  },
  {
    id: 'people',
    name: 'Gestes & Personnes',
    icon: <User size={18} />,
    emojis: [
      { char: '👋', keywords: 'coucou salut main bonjour au revoir' },
      { char: '🤚', keywords: 'dos de main stop pause' },
      { char: '🖐️', keywords: 'main ouverte cinq salutation' },
      { char: '✋', keywords: 'main levée stop bénédiction' },
      { char: '🖖', keywords: 'salut vulcain paix longue vie' },
      { char: '👌', keywords: 'd\'accord parfait ok super' },
      { char: '🤌', keywords: 'geste italien qu\'est-ce que tu veux' },
      { char: '🤏', keywords: 'un peu minuscule pincée' },
      { char: '✌️', keywords: 'paix victoire deux salut' },
      { char: '🤞', keywords: 'doigts croisés espoir chance prière' },
      { char: '🫰', keywords: 'coeur coréen doigts amour mignon' },
      { char: '🤟', keywords: 'je t\'aime amour langue des signes' },
      { char: '🤘', keywords: 'rock cornes fête' },
      { char: '🤙', keywords: 'appelle-moi shaka cool détendu' },
      { char: '👈', keywords: 'pointe gauche regarde' },
      { char: '👉', keywords: 'pointe droite regarde ici' },
      { char: '👆', keywords: 'pointe haut regarde en haut ciel' },
      { char: '👇', keywords: 'pointe bas regarde ci-dessous' },
      { char: '☝️', keywords: 'doigt levé un seul dieu attention' },
      { char: '👍', keywords: 'pouce en haut super validé j\'aime bien' },
      { char: '👎', keywords: 'pouce en bas désaccord pas bien' },
      { char: '✊', keywords: 'poing levé force solidarité' },
      { char: '👊', keywords: 'check poing force salut coup' },
      { char: '🤛', keywords: 'poing gauche check' },
      { char: '🤜', keywords: 'poing droit check' },
      { char: '👏', keywords: 'applaudissements bravo félicitations claps' },
      { char: '🙌', keywords: 'mains levées louange gloire alléluia célébration' },
      { char: '🫶', keywords: 'mains coeur amour tendresse affection' },
      { char: '👐', keywords: 'mains ouvertes accueil ouverture don' },
      { char: '🤲', keywords: 'mains jointes prière dua demande bénédiction' },
      { char: '🤝', keywords: 'poignée de main accord alliance entente respect' },
      { char: '🙏', keywords: 'prière merci prier foi s\'il vous plait reconnaissance' },
      { char: '✍️', keywords: 'écrire stylo lettre message écriture' },
      { char: '💅', keywords: 'ongles vernis beauté soin' },
      { char: '🤳', keywords: 'selfie photo portable' },
      { char: '💪', keywords: 'muscle force courage détermination puissant' },
      { char: '👀', keywords: 'yeux regard attentif curieux regarde' },
      { char: '👁️', keywords: 'oeil vision regard' },
      { char: '🫂', keywords: 'étreinte calin réconfort amitié soutien' },
      { char: '👶', keywords: 'bébé nouveau-né enfant naissance' },
      { char: '🧒', keywords: 'enfant innocence jeune' },
      { char: '👦', keywords: 'garçon fils jeune homme' },
      { char: '👧', keywords: 'fille jeune fille filleul' },
      { char: '🧑', keywords: 'adulte personne humain' },
      { char: '👱', keywords: 'personne blonde cheveux dorés' },
      { char: '👨', keywords: 'homme monsieur' },
      { char: '🧔', keywords: 'homme barbu barbe mature' },
      { char: '👩', keywords: 'femme madame demoiselle' },
      { char: '🧓', keywords: 'personne âgée sagesse aîné' },
      { char: '👴', keywords: 'grand-père vieil homme sage' },
      { char: '👵', keywords: 'grand-mère dame sage mamie' },
      { char: '🤵', keywords: 'marié costume noce élégant' },
      { char: '👰', keywords: 'mariée robe blanche noce alliance' },
      { char: '🙇', keywords: 'inclinaison respect pardon humilité' },
      { char: '🙋', keywords: 'main levée je suis là présent question' },
      { char: '🤷', keywords: 'hausser les épaules je ne sais pas qui sait' }
    ]
  },
  {
    id: 'faith',
    name: 'Foi & Spiritualité',
    icon: <Church size={18} />,
    emojis: [
      { char: '✝️', keywords: 'croix christ jesus foi chretien chretienne salut' },
      { char: '🕊️', keywords: 'colombe saint-esprit paix purete oiseau grace' },
      { char: '📖', keywords: 'bible ecritures saintes parole livre verbe mediter' },
      { char: '⛪', keywords: 'eglise temple sanctuaire priere culte paroisse' },
      { char: '🕯️', keywords: 'bougie chandelle veilleuse priere lumiere ferveur' },
      { char: '📿', keywords: 'chapelet rosaire perles meditation priere' },
      { char: '👼', keywords: 'ange messager divin celeste purete protection' },
      { char: '🍞', keywords: 'pain communion corps de christ cene nourriture celeste' },
      { char: '🍷', keywords: 'vin sainte cene calice sang de la nouvelle alliance' },
      { char: '👑', keywords: 'couronne roi des rois royaute seigneurie gloire' },
      { char: '🌟', keywords: 'etoile bethleem gloire guide divine' },
      { char: '✨', keywords: 'etincelles lumiere divine grace eclat saintete' },
      { char: '☀️', keywords: 'soleil justice lumiere aube jour nouveau clarte' },
      { char: '🌈', keywords: 'arc-en-ciel alliance promesse divine noé paix' },
      { char: '🔔', keywords: 'cloche appel culte temple joie clocher' },
      { char: '🛡️', keywords: 'bouclier foi armure de dieu protection defence' },
      { char: '⚔️', keywords: 'epee esprit parole de dieu verite combat spirituel' },
      { char: '🍇', keywords: 'vigne vrai cep saint esprit fruits abondance' },
      { char: '🌾', keywords: 'ble moisson recolte champs gerbe travail' },
      { char: '💒', keywords: 'mariage eglise sainte union alliance benediction' },
      { char: '🛐', keywords: 'lieu de culte ferveur adoration agenouillement' },
      { char: '📜', keywords: 'parchemin rouleau loi testament prophete' },
      { char: '🎺', keywords: 'trompette réveil louange célébration appel ange' },
      { char: '🤍', keywords: 'coeur blanc purete paix amour inconditionnel agape' }
    ]
  },
  {
    id: 'hearts',
    name: 'Cœurs & Amour',
    icon: <Heart size={18} />,
    emojis: [
      { char: '❤️', keywords: 'coeur rouge amour passion affection' },
      { char: '🧡', keywords: 'coeur orange chaleur amitié tendresse' },
      { char: '💛', keywords: 'coeur jaune lumière fidélité or' },
      { char: '💚', keywords: 'coeur vert espérance renouveau nature' },
      { char: '💙', keywords: 'coeur bleu paix vérité confiance fidélité' },
      { char: '💜', keywords: 'coeur violet royauté douceur spiritualité' },
      { char: '🤎', keywords: 'coeur marron terre authenticité stabilité' },
      { char: '🖤', keywords: 'coeur noir élégance profondeur' },
      { char: '🤍', keywords: 'coeur blanc pureté paix amour divin' },
      { char: '🩷', keywords: 'coeur rose tendresse délicatesse douceur' },
      { char: '🩵', keywords: 'coeur bleu ciel calme pureté' },
      { char: '🩶', keywords: 'coeur gris modération discrétion' },
      { char: '💔', keywords: 'coeur brisé peine tristesse blessure' },
      { char: '❤️‍🔥', keywords: 'coeur en feu passion flamme zèle' },
      { char: '❤️‍🩹', keywords: 'coeur pansé guérison réconciliation espoir' },
      { char: '❣️', keywords: 'point d\'exclamation coeur emphase amour' },
      { char: '💕', keywords: 'deux coeurs sentiment réciproque amour' },
      { char: '💞', keywords: 'coeurs qui tournent communion union' },
      { char: '💓', keywords: 'coeur qui bat émotion battement amour' },
      { char: '💗', keywords: 'coeur grandissant amour grandissant' },
      { char: '💖', keywords: 'coeur scintillant étincelles éclat précieux' },
      { char: '💘', keywords: 'coeur flèche coup de foudre amour' },
      { char: '💝', keywords: 'coeur ruban cadeau offrande don' },
      { char: '💟', keywords: 'décoration coeur motif paix' },
      { char: '💌', keywords: 'lettre d\'amour mot doux message lettre' },
      { char: '💍', keywords: 'bague alliance fiançailles mariage engagement or diamant' },
      { char: '💎', keywords: 'diamant pierre précieuse valeur trésor pur' },
      { char: '💐', keywords: 'bouquet fleurs offrande fête déclaration' },
      { char: '🌹', keywords: 'rose rouge fleur amour beauté parfum' },
      { char: '🥀', keywords: 'rose fanée souvenir regret' },
      { char: '🌺', keywords: 'hibiscus fleur délicate' },
      { char: '🌸', keywords: 'cerisier fleur de cerisier renouveau' },
      { char: '🌷', keywords: 'tulipe printemps élégance' },
      { char: '🪷', keywords: 'lotus pureté sérénité' },
      { char: '💒', keywords: 'mariage célébration église sacrement' },
      { char: '👩‍❤️‍👨', keywords: 'couple homme femme amour béni mariage' },
      { char: '👩‍❤️‍💋‍👨', keywords: 'baiser couple tendresse bisou' },
      { char: '💏', keywords: 'baiser amour affection couple' },
      { char: '💑', keywords: 'couple amour coeur union' },
      { char: '🫀', keywords: 'coeur anatomique vie battement organe' }
    ]
  },
  {
    id: 'nature',
    name: 'Animaux & Nature',
    icon: <Dog size={18} />,
    emojis: [
      { char: '🐶', keywords: 'chien chiot fidèle fidèle animal' },
      { char: '🐱', keywords: 'chat chaton doux félin' },
      { char: '🐭', keywords: 'souris petit animal' },
      { char: '🐹', keywords: 'hamster animal rongeur' },
      { char: '🐰', keywords: 'lapin doux nature' },
      { char: '🦊', keywords: 'renard rusé nature bois' },
      { char: '🐻', keywords: 'ours doux force' },
      { char: '🐼', keywords: 'panda mignon doux asie' },
      { char: '🐨', keywords: 'koala australie mignon' },
      { char: '🐯', keywords: 'tigre félin force rayure' },
      { char: '🦁', keywords: 'lion roi de la savane tribu de juda force majesté' },
      { char: '🐮', keywords: 'vache campagne pré' },
      { char: '🐷', keywords: 'cochon ferme' },
      { char: '🐸', keywords: 'grenouille mare nature' },
      { char: '🐵', keywords: 'singe rigolo' },
      { char: '🐔', keywords: 'poule coq matin basse-cour' },
      { char: '🐧', keywords: 'manchot pingouin froid banquise' },
      { char: '🐦', keywords: 'oiseau chant ciel liberté' },
      { char: '🐤', keywords: 'poussin naissance nouveau mignon' },
      { char: '🦆', keywords: 'canard lac étang' },
      { char: '🦅', keywords: 'aigle majesté envol hauteur vision force' },
      { char: '🦉', keywords: 'chouette hibou sagesse nuit clairvoyance' },
      { char: '🐴', keywords: 'cheval monture course noble' },
      { char: '🦄', keywords: 'licorne féerique grâce' },
      { char: '🐝', keywords: 'abeille miel travail communauté ruche' },
      { char: '🦋', keywords: 'papillon métamorphose renouveau résurrection' },
      { char: '🐌', keywords: 'escargot patience lenteur' },
      { char: '🐞', keywords: 'coccinelle bonheur porte-chance insecte' },
      { char: '🐢', keywords: 'tortue longévité patience sagesse' },
      { char: '🐬', keywords: 'dauphin mer océan joie nager' },
      { char: '🐳', keywords: 'baleine océan immensité jonas' },
      { char: '🐘', keywords: 'éléphant mémoire force sagesse majesté' },
      { char: '🐑', keywords: 'brebis agneau berger pureté troupeau' },
      { char: '🌸', keywords: 'fleur printemps beauté' },
      { char: '🌻', keywords: 'tournesol soleil lumière clarté' },
      { char: '🌹', keywords: 'rose rouge fleur parfum' },
      { char: '🌷', keywords: 'tulipe printemps renouveau' },
      { char: '🌼', keywords: 'fleur jaune blanche' },
      { char: '🌾', keywords: 'blé céréale moisson recolte gerbe' },
      { char: '🌿', keywords: 'herbe plante rameau de paix feuille' },
      { char: '☘️', keywords: 'trèfle trinité irlande feuille' },
      { char: '🍀', keywords: 'trèfle à quatre feuilles grâce bénédiction chance' },
      { char: '🍁', keywords: 'feuille érable automne couleur' },
      { char: '🍂', keywords: 'feuilles mortes saison cycle' },
      { char: '🍃', keywords: 'feuille au vent souffle esprit brise' },
      { char: '🌴', keywords: 'palmier désert oasis triomphe rameaux' },
      { char: '🌲', keywords: 'sapin toujours vert persévérance' },
      { char: '🌳', keywords: 'arbre arbre de vie racines fondations' }
    ]
  },
  {
    id: 'food',
    name: 'Nourriture & Boissons',
    icon: <Utensils size={18} />,
    emojis: [
      { char: '🍏', keywords: 'pomme verte fruit santé' },
      { char: '🍎', keywords: 'pomme rouge fruit doux' },
      { char: '🍐', keywords: 'poire fruit verger' },
      { char: '🍊', keywords: 'orange agrume vitamine' },
      { char: '🍋', keywords: 'citron fraîcheur zeste' },
      { char: '🍌', keywords: 'banane énergie fruit' },
      { char: '🍉', keywords: 'pastèque été fraîcheur' },
      { char: '🍇', keywords: 'raisin grappe vigne vin' },
      { char: '🍓', keywords: 'fraise délice dessert rouge' },
      { char: '🫐', keywords: 'myrtille baie sauvage' },
      { char: '🍒', keywords: 'cerises duo fruit doux' },
      { char: '🍑', keywords: 'pêche velouté douceur' },
      { char: '🥭', keywords: 'mangue tropical soleil saveur' },
      { char: '🍍', keywords: 'ananas hospitalité accueil tropical' },
      { char: '🥥', keywords: 'noix de coco île tropical' },
      { char: '🥑', keywords: 'avocat repas bon sain' },
      { char: '🍞', keywords: 'pain quotidien nourriture partage' },
      { char: '🥐', keywords: 'croissant petit-déjeuner matin viennoiserie' },
      { char: '🥖', keywords: 'baguette tradition française pain' },
      { char: '🧀', keywords: 'fromage repas tradition' },
      { char: '🥞', keywords: 'pancakes crêpes brunch gourmand' },
      { char: '🍳', keywords: 'oeuf plat cuisine repas' },
      { char: '🥩', keywords: 'viande festin grillade' },
      { char: '🍗', keywords: 'poulet volaille rôti' },
      { char: '🥪', keywords: 'sandwich repas rapide pique-nique' },
      { char: '🍕', keywords: 'pizza convivialité partage' },
      { char: '🍝', keywords: 'pâtes spaghetti cuisine italienne repas' },
      { char: '🍜', keywords: 'nouilles soupe réconfort bol' },
      { char: '🍚', keywords: 'riz blanc aliment base bol' },
      { char: '🎂', keywords: 'gâteau anniversaire fête célébration bougies' },
      { char: '🍰', keywords: 'part de gâteau pâtisserie douceur' },
      { char: '🧁', keywords: 'cupcake muffin dessert mignon' },
      { char: '🍫', keywords: 'chocolat gourmandise cacao plaisir' },
      { char: '🍩', keywords: 'donut beignet sucre' },
      { char: '🍪', keywords: 'biscuit cookie fait maison réconfort' },
      { char: '☕', keywords: 'café thé boisson chaude réveil discussion matin pause' },
      { char: '🍵', keywords: 'thé vert infusion tisane apaisant calme' },
      { char: '🧃', keywords: 'jus de fruit boisson paille' },
      { char: '🥤', keywords: 'gobelet paille soda boisson' },
      { char: '🥛', keywords: 'verre de lait pureté boisson' },
      { char: '🍷', keywords: 'verre de vin sainte cene repas' },
      { char: '🍾', keywords: 'champagne célébration déboucher fête' },
      { char: '🥂', keywords: 'trinquer santé toast célébration voeux' }
    ]
  },
  {
    id: 'activities',
    name: 'Activités & Voyages',
    icon: <Trophy size={18} />,
    emojis: [
      { char: '⚽', keywords: 'ballon de foot football sport match' },
      { char: '🏀', keywords: 'basket basketball sport panier' },
      { char: '🏈', keywords: 'football américain ballon' },
      { char: '🎾', keywords: 'tennis balle raquette sport' },
      { char: '🏐', keywords: 'volleyball plage sport' },
      { char: '🏉', keywords: 'rugby sport oval' },
      { char: '🎱', keywords: 'billard boule 8 jeu' },
      { char: '🏓', keywords: 'ping pong tennis de table jeu' },
      { char: '🥊', keywords: 'gants de boxe combat entrainement' },
      { char: '🥇', keywords: 'médaille d\'or victoire premier vainqueur excellence' },
      { char: '🥈', keywords: 'médaille d\'argent deuxième podium' },
      { char: '🥉', keywords: 'médaille de bronze troisième' },
      { char: '🏆', keywords: 'trophée coupe champion victoire gloire' },
      { char: '🎯', keywords: 'cible fléchette but objectif précision' },
      { char: '🎨', keywords: 'palette peinture art créativité dessin' },
      { char: '🎬', keywords: 'clap cinéma film tournage' },
      { char: '🎤', keywords: 'micro chant louange chorale voix prise de parole' },
      { char: '🎧', keywords: 'casque audio musique écoute méditation' },
      { char: '🎼', keywords: 'partition notes musique solfège' },
      { char: '🎹', keywords: 'piano clavier musique louange harmonie' },
      { char: '🥁', keywords: 'batterie tambour rythme pulsation' },
      { char: '🎷', keywords: 'saxophone jazz musique cuivre' },
      { char: '🎺', keywords: 'trompette louange appel cuivre' },
      { char: '🎸', keywords: 'guitare acoustique louange corde mélodie' },
      { char: '🎻', keywords: 'violon classique musique douce' },
      { char: '🚗', keywords: 'voiture route voyage déplacement balade' },
      { char: '🚕', keywords: 'taxi transport ville' },
      { char: '✈️', keywords: 'avion vol voyage mission ciel aventure départ' },
      { char: '🚀', keywords: 'fusée ascension vitesse décollage avenir' },
      { char: '⛵', keywords: 'voilier mer vent aventure calme traversée' },
      { char: '🚢', keywords: 'navire paquebot voyage mer croisière' },
      { char: '🏰', keywords: 'château forteresse refuge rempart cité' },
      { char: '⛺', keywords: 'tente bivouac camp retraite nature' }
    ]
  },
  {
    id: 'objects',
    name: 'Objets & Symboles',
    icon: <Lamp size={18} />,
    emojis: [
      { char: '⌚', keywords: 'montre heure temps ponctualité rendez-vous' },
      { char: '📱', keywords: 'téléphone smartphone message appel contact' },
      { char: '💻', keywords: 'ordinateur portable travail étude écran' },
      { char: '📷', keywords: 'appareil photo souvenir cliché instantané' },
      { char: '📖', keywords: 'livre lecture étude savoir' },
      { char: '💰', keywords: 'sac d\'argent finances richesse épargne don' },
      { char: '💎', keywords: 'diamant trésor valeur précieux éclat' },
      { char: '🎁', keywords: 'cadeau présent surprise bénédiction offrande' },
      { char: '🎈', keywords: 'ballon fête anniversaire joie envol' },
      { char: '🎉', keywords: 'cotillons fête célébration joie félicitations' },
      { char: '🎊', keywords: 'confettis explosion joie victoire événement' },
      { char: '✉️', keywords: 'enveloppe lettre message courrier mot' },
      { char: '📦', keywords: 'colis paquet livraison cadeau' },
      { char: '🔑', keywords: 'clé ouverture solution accès secret royaume' },
      { char: '🔒', keywords: 'cadenas fermé sécurité fidélité protection' },
      { char: '🕯️', keywords: 'chandelle lumière flamme prière veillée' },
      { char: '💡', keywords: 'ampoule idée inspiration révélation lumière' },
      { char: '💯', keywords: 'cent pour cent parfait validé authentique exact' },
      { char: '💢', keywords: 'symbole colère éclat' },
      { char: '💥', keywords: 'explosion impact choc force' },
      { char: '💫', keywords: 'étoile filante vertige magie' },
      { char: '⭐', keywords: 'étoile lumière guide splendeur' },
      { char: '🔥', keywords: 'feu flamme passion zèle réveil esprit saint' },
      { char: '⚡', keywords: 'éclair foudre puissance énergie rapide' },
      { char: '☀️', keywords: 'soleil jour lumière clarté' },
      { char: '🌙', keywords: 'lune nuit croissant repos calme' },
      { char: '🎵', keywords: 'note de musique mélodie chant' },
      { char: '🎶', keywords: 'notes de musique chant de louange' },
      { char: '✔️', keywords: 'crochet validation validé accord parfait' },
      { char: '❌', keywords: 'croix rouge faux refus' }
    ]
  },
  {
    id: 'flags',
    name: 'Drapeaux',
    icon: <Flag size={18} />,
    emojis: [
      { char: '🇨🇲', keywords: 'cameroun camerounais douala yaounde 237 lion indomptable' },
      { char: '🇫🇷', keywords: 'france francais paris drapeau tricolore' },
      { char: '🇨🇮', keywords: 'cote d\'ivoire abidjan ivoirien elephant' },
      { char: '🇨🇩', keywords: 'rdc congo kinshasa congolais' },
      { char: '🇬🇦', keywords: 'gabon libreville gabonais' },
      { char: '🇸🇳', keywords: 'senegal dakar senegalais teranga' },
      { char: '🇧🇯', keywords: 'benin cotonou beninois' },
      { char: '🇹🇬', keywords: 'togo lome togolais' },
      { char: '🇨🇬', keywords: 'congo brazzaville' },
      { char: '🇧🇪', keywords: 'belgique bruxelles belge' },
      { char: '🇨🇭', keywords: 'suisse geneve bern suisse' },
      { char: '🇨🇦', keywords: 'canada quebec montreal canadien feuille érable' },
      { char: '🇺🇸', keywords: 'usa etats-unis amerique new york' },
      { char: '🇬🇧', keywords: 'royaume-uni londres angleterre british' },
      { char: '🇳🇬', keywords: 'nigeria lagos abuja nigerian' },
      { char: '🇬🇭', keywords: 'ghana accra ghanéen' },
      { char: '🇿🇦', keywords: 'afrique du sud johannesburg' },
      { char: '🏁', keywords: 'drapeau damier course arrivée victoire' },
      { char: '🚩', keywords: 'drapeau rouge signal balise' },
      { char: '🏳️', keywords: 'drapeau blanc paix réconciliation trêve' }
    ]
  }
];

export default function WhatsAppEmojiPicker({ onSelectEmoji, onClose }: WhatsAppEmojiPickerProps) {
  const [activeTab, setActiveTab] = useState<string>('smileys');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Récents stockés localement
  const [recentEmojis, setRecentEmojis] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('gsd_recent_emojis');
      return stored ? JSON.parse(stored) : ['🙏', '❤️', '✝️', '🕊️', '📖', '😊', '💍', '💐'];
    } catch {
      return ['🙏', '❤️', '✝️', '🕊️', '📖', '😊', '💍', '💐'];
    }
  });

  const handleEmojiClick = (emoji: string) => {
    onSelectEmoji(emoji);
    setRecentEmojis(prev => {
      const filtered = prev.filter(e => e !== emoji);
      const updated = [emoji, ...filtered].slice(0, 24);
      try {
        localStorage.setItem('gsd_recent_emojis', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Filtrage selon recherche
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matched: string[] = [];
    EMOJI_CATEGORIES.forEach(cat => {
      cat.emojis.forEach(item => {
        if (item.keywords.includes(q) || item.char === q) {
          if (!matched.includes(item.char)) {
            matched.push(item.char);
          }
        }
      });
    });
    return matched;
  }, [searchQuery]);

  return (
    <div className="w-full bg-white border-t border-[#EFECE6] shadow-xl flex flex-col h-72 sm:h-80 select-none animate-in slide-in-from-bottom-2 duration-200">
      {/* Header avec Barre de recherche WhatsApp */}
      <div className="px-3 pt-2.5 pb-2 border-b border-[#EFECE6] flex items-center gap-2 bg-[#FCFBF9]">
        <div className="relative flex-1 flex items-center bg-white rounded-full px-3 py-1.5 border border-[#EFECE6] shadow-inner text-xs focus-within:border-[#C9A84C] transition-colors">
          <Search size={14} className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un émoji (prière, coeur, rire, bible...)"
            className="w-full bg-transparent border-none outline-none text-xs text-gray-800 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600 ml-1 p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Fermer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Onglets des catégories façon WhatsApp */}
      {!searchQuery && (
        <div className="flex items-center justify-between px-2 py-1.5 bg-[#FAF9F6] border-b border-[#EFECE6] overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('recent')}
            className={`p-2 rounded-xl text-xs flex items-center justify-center transition-all ${
              activeTab === 'recent'
                ? 'bg-white text-[#C9A84C] shadow-sm font-bold scale-105'
                : 'text-gray-400 hover:text-gray-600 hover:bg-white/60'
            }`}
            title="Récents"
          >
            <History size={16} />
          </button>

          {EMOJI_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`p-2 rounded-xl text-xs flex items-center justify-center transition-all ${
                activeTab === cat.id
                  ? 'bg-white text-[#1A3A5C] shadow-sm font-bold scale-105'
                  : 'text-gray-400 hover:text-[#1A3A5C] hover:bg-white/60'
              }`}
              title={cat.name}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Grille d'émojis principale */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {searchResults !== null ? (
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Résultats ({searchResults.length})
            </div>
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">
                Aucun émoji trouvé pour « {searchQuery} »
              </div>
            ) : (
              <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 sm:gap-2">
                {searchResults.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="h-10 text-2xl flex items-center justify-center rounded-xl hover:bg-[#FAF9F6] hover:scale-125 active:scale-95 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'recent' ? (
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <History size={13} className="text-[#C9A84C]" /> Émojis récents & Fréquents
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 sm:gap-2">
              {recentEmojis.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="h-10 text-2xl flex items-center justify-center rounded-xl hover:bg-[#FAF9F6] hover:scale-125 active:scale-95 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {(() => {
              const currentCat = EMOJI_CATEGORIES.find(c => c.id === activeTab) || EMOJI_CATEGORIES[0];
              return (
                <div key={currentCat.id}>
                  <div className="text-[11px] font-bold text-[#1A3A5C] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-[#C9A84C]">{currentCat.icon}</span>
                    <span>{currentCat.name}</span>
                    <span className="text-gray-400 font-normal text-[10px]">({currentCat.emojis.length})</span>
                  </div>
                  <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 sm:gap-2">
                    {currentCat.emojis.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleEmojiClick(item.char)}
                        title={item.keywords}
                        className="h-10 text-2xl flex items-center justify-center rounded-xl hover:bg-[#FAF9F6] hover:scale-125 active:scale-95 transition-transform"
                      >
                        {item.char}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
