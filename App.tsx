
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

// =====================================
// 1. Type Evenement
// =====================================

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

// =====================================
// 2. Données des événements
// =====================================

const evenements: Evenement[] = [
  {
    id: 'E01',
    titre: 'Atelier React',
    categorie: 'Atelier',
    capacite: 25,
    inscrits: 25,
  },
  {
    id: 'E02',
    titre: 'Conférence IA',
    categorie: 'Conférence',
    capacite: 70,
    inscrits: 52,
  },
  {
    id: 'E03',
    titre: 'Sécurité mobile',
    categorie: 'Atelier',
    capacite: 20,
    inscrits: 17,
  },
  {
    id: 'E04',
    titre: 'Design UI',
    categorie: 'Atelier',
    capacite: 18,
    inscrits: 9,
  },
  {
    id: 'E05',
    titre: 'Forum projets',
    categorie: 'Rencontre',
    capacite: 50,
    inscrits: 49,
  },
  {
    id: 'E06',
    titre: 'Découverte Git',
    categorie: 'Atelier',
    capacite: 24,
    inscrits: 24,
  },
];

// =====================================
// 3. Fonction placesRestantes
// =====================================

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

// =====================================
// 4. Fonction statutEvenement
// =====================================

function statutEvenement(e: Evenement): string {
  const r = placesRestantes(e);

  return r === 0
    ? 'Complet'
    : r <= 3
    ? 'Presque complet'
    : 'Ouvert';
}

// =====================================
// 5. Indicateurs globaux
// =====================================

const nombreTotal = evenements.length;

const nombreComplets = evenements.filter(
  (e) => placesRestantes(e) === 0
).length;

const nombreAvecPlaces = evenements.filter(
  (e) => placesRestantes(e) > 0
).length;

const totalPlacesRestantes = evenements.reduce(
  (somme, e) => somme + placesRestantes(e),
  0
);

// =====================================
// 6. Ateliers disponibles
// =====================================

const ateliersDisponibles = evenements.filter(
  (e) =>
    e.categorie === 'Atelier' &&
    placesRestantes(e) > 0
);

// =====================================
// 7. Composant BadgeEtat
// =====================================

type BadgeEtatProps = {
  statut: string; 
};

function BadgeEtat({ statut }: BadgeEtatProps) {
  const couleur =
    statut === 'Complet'
      ? styles.badgeComplet
      : statut === 'Presque complet'
      ? styles.badgePresque
      : styles.badgeOuvert;

  return (
    <View style={[styles.badge, couleur]}>
      <Text style={styles.texteBadge}>{statut}</Text>
    </View>
  );
}

// =====================================
// 8. Composant CarteEvenement
// =====================================

type CarteEvenementProps = {
  evenement: Evenement;
};

function CarteEvenement({
  evenement,
}: CarteEvenementProps) {
  const { titre, categorie } = evenement;
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.carte}>
      <Text style={styles.titreCarte}>{titre}</Text>

      <Text style={styles.information}>
        Catégorie : {categorie}
      </Text>

      <Text style={styles.information}>
        Places restantes : {placesRestantes(evenement)}
      </Text>

      <BadgeEtat statut={statut} />
    </View>
  );
}

// =====================================
// 9. Composant BlocStatistique
// =====================================

type BlocStatistiqueProps = {
  libelle: string;
  nombre: number;
};

function BlocStatistique({
  libelle,
  nombre,
}: BlocStatistiqueProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.libelle}>{libelle}</Text>
      <Text style={styles.nombre}>{nombre}</Text>
    </View>
  );
}

// =====================================
// 10. Application principale App
// =====================================


export default function App() {

  // Mode d'affichage
  const mode: string = 'ateliers';

  // Filtrage des événements
  const evenementsAffiches =
    mode === 'tous'
      ? evenements
      : evenements.filter(
          (e) =>
            e.categorie === 'Atelier' &&
            placesRestantes(e) > 0
        );

  // Titre selon le mode
  const titreMode =
    mode === 'tous'
      ? 'les six événements'
      : 'seulement les événements de catégorie ’Atelier’ayant au moins une place restante.';

  return (
    <View style={styles.page}>

      <Text style={styles.titre}>CampusAgenda</Text>

      <Text style={styles.sousTitre}>
        Gestion des événements universitaires
      </Text>

      <View style={styles.statistiques}>
        <BlocStatistique
          libelle="Nombre d'événements"
          nombre={nombreTotal}
        />

        <BlocStatistique
          libelle="Événements complets"
          nombre={nombreComplets}
        />

        <BlocStatistique
          libelle="Événements avec places"
          nombre={nombreAvecPlaces}
        />

        <BlocStatistique
          libelle="Places restantes"
          nombre={totalPlacesRestantes}
        />
      </View>

      {/* Titre du mode actuel */}
      <Text style={styles.titreSection}>
        {titreMode}
      </Text>

      {/* Liste filtrée */}
      <FlatList
        data={evenementsAffiches}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}
        ListEmptyComponent={
          <Text style={styles.messageVide}>
            Aucun événement à afficher.
          </Text>
        }
        contentContainerStyle={styles.liste}
      />

    </View>
  );
}

// =====================================
// 11. Styles
// =====================================

const styles = StyleSheet.create({

  page: {
    flex: 1,
    paddingTop: 55,
    paddingHorizontal: 18,
    backgroundColor: '#F2F7FD',
  },

  titre: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00235C',
  },

  sousTitre: {
    fontSize: 15,
    color: '#4C5360',
    marginBottom: 20,
  },

  statistiques: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  bloc: {
    width: '48%',
    padding: 15,
    backgroundColor: '#DCEBFF',
    borderRadius: 12,
  },

  libelle: {
    fontSize: 14,
    color: '#4C5360',
  },

  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00235C',
    marginTop: 5,
  },

  titreSection: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00235C',
    marginTop: 22,
    marginBottom: 12,
  },

  liste: {
    paddingBottom: 30,
  },

  carte: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
  },

  titreCarte: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00235C',
  },

  information: {
    fontSize: 14,
    color: '#4C5360',
    marginTop: 5,
  },

  badge: {
    padding: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
  },

  badgeComplet: {
    backgroundColor: '#FFE5E5',
  },

  badgePresque: {
    backgroundColor: '#FFF0CC',
  },

  badgeOuvert: {
    backgroundColor: '#D6F5E7',
  },

  texteBadge: {
    fontWeight: 'bold',
    color: '#00235C',
  },

  messageVide: {
    textAlign: 'center',
    fontSize: 16,
    color: '#4C5360',
    marginTop: 30,
  },

});
