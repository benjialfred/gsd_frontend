import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, Search, Navigation, Heart, Sparkles, ShieldCheck, 
  Church, Compass, X, ChevronRight, Filter, Layers, 
  Flame, CheckCircle, Briefcase, GraduationCap, RefreshCw, ZoomIn, ZoomOut
} from 'lucide-react';
import api from '../../../services/api';
import { toast } from '../../../stores/useToastStore';
import { getMediaUrl } from '../../../services/profile';

const GEOAPIFY_API_KEY = '5847ad4796b04eb183e6c59c64911d0c';

// Presets des villes phares
const PRESET_CITIES = [
  { name: 'Douala', lat: 4.051056, lng: 9.767868, country: 'CM' },
  { name: 'Yaoundé', lat: 3.848033, lng: 11.502075, country: 'CM' },
  { name: 'Bafoussam', lat: 5.477751, lng: 10.417571, country: 'CM' },
  { name: 'Kribi', lat: 2.937222, lng: 9.907778, country: 'CM' },
  { name: 'Abidjan', lat: 5.359952, lng: -4.008256, country: 'CI' },
  { name: 'Paris', lat: 48.856614, lng: 2.3522219, country: 'FR' },
];

const RADIUS_OPTIONS = [
  { label: '15 km', value: 15 },
  { label: '35 km', value: 35 },
  { label: '75 km', value: 75 },
  { label: '150 km', value: 150 },
  { label: '300 km', value: 300 },
  { label: 'Partout', value: 0 },
];

const DENOMINATIONS = [
  { label: 'Toutes confessions', value: 'ALL' },
  { label: 'Évangélique', value: 'Évangélique' },
  { label: 'Catholique', value: 'Catholique' },
  { label: 'Pentecôtiste', value: 'Pentecôtiste' },
  { label: 'Protestant', value: 'Protestant' },
  { label: 'Baptiste', value: 'Baptiste' },
  { label: 'Adventiste', value: 'Adventiste' },
];

export interface MapProfile {
  id: number;
  first_name: string;
  last_name?: string;
  age: number;
  gender: string;
  city: string;
  country_code: string;
  denomination: string;
  church_attendance: string;
  profession: string;
  marriage_vision: string;
  avatar: string | null;
  latitude: number;
  longitude: number;
  distance_km: number;
  compatibility: number;
  breakdown?: {
    faith?: number;
    values?: number;
    lifestyle?: number;
    location?: number;
  };
  explanation?: {
    strongest_factor?: string;
    summary?: string;
  };
  kyc_verified: boolean;
  is_online?: boolean;
}

interface MatchMapDiscoveryProps {
  onSelectCandidate?: (candidateId: number) => void;
  onMutualMatch?: (partner: any, matchId?: number) => void;
}

export const MatchMapDiscovery: React.FC<MatchMapDiscoveryProps> = ({
  onSelectCandidate,
  onMutualMatch,
}) => {
  // Coordonnées du centre (par défaut Douala)
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 4.051056,
    lng: 9.767868,
  });
  const [cityName, setCityName] = useState('Douala');
  const [radius, setRadius] = useState<number>(35);
  const [denomination, setDenomination] = useState<string>('ALL');
  const [mapStyle, setMapStyle] = useState<'osm-bright' | 'positron'>('osm-bright');

  // Données & état UI
  const [profiles, setProfiles] = useState<MapProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MapProfile | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<Set<number>>(new Set());

  // Autocomplete recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtres avancés dépliables
  const [showFilters, setShowFilters] = useState(false);

  // Références Leaflet
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // 1. Initialiser la carte Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Déjà initialisé

    // Création de l'instance Leaflet
    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: 12,
      zoomControl: false, // On utilise nos boutons stylisés
      attributionControl: true,
    });

    // Tuiles Geoapify
    const tileUrl = `https://maps.geoapify.com/v1/tile/${mapStyle}/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;
    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | &copy; OpenStreetMap',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Couche de marqueurs
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Cercle de radar
    if (radius > 0) {
      const circle = L.circle([center.lat, center.lng], {
        radius: radius * 1000,
        color: '#C9A84C',
        fillColor: '#C9A84C',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 8',
      }).addTo(map);
      circleLayerRef.current = circle;
    }

    // Marqueur du centre (Vous êtes ici / Centre de recherche)
    const centerIcon = L.divIcon({
      className: 'gsd-center-marker-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2.5 rounded-full bg-[#1A3A5C]/25 animate-ping"></div>
          <div class="w-8 h-8 rounded-full bg-[#1A3A5C] border-2 border-[#C9A84C] flex items-center justify-center shadow-xl text-[#C9A84C]">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const centerMarker = L.marker([center.lat, center.lng], { icon: centerIcon })
      .addTo(map)
      .bindTooltip("Votre point d'ancrage radar", { direction: 'top', offset: [0, -16] });

    centerMarkerRef.current = centerMarker;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Mettre à jour le style de la carte Geoapify
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const newTileUrl = `https://maps.geoapify.com/v1/tile/${mapStyle}/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;
    tileLayerRef.current.setUrl(newTileUrl);
  }, [mapStyle]);

  // 3. Charger les profils du backend
  const fetchProfiles = useCallback(async (lat: number, lng: number, rad: number, den: string) => {
    setLoading(true);
    try {
      const params: any = {
        lat,
        lng,
        radius: rad,
      };
      if (den && den !== 'ALL') {
        params.denomination = den;
      }

      const res = await api.get('/api/matchmaking/map-search/', { params });
      const fetchedProfiles: MapProfile[] = res.data.profiles || [];
      setProfiles(fetchedProfiles);

      // Si le profil sélectionné n'est plus dans la liste, le fermer
      if (selectedProfile && !fetchedProfiles.some(p => p.id === selectedProfile.id)) {
        setSelectedProfile(null);
      }
    } catch (err) {
      console.error('Erreur chargement map search:', err);
      toast.error('Impossible de charger les âmes sœurs autour de cette position.');
    } finally {
      setLoading(false);
    }
  }, [selectedProfile]);

  // Déclencher le rechargement dès que le centre, rayon ou confession change
  useEffect(() => {
    fetchProfiles(center.lat, center.lng, radius, denomination);
  }, [center.lat, center.lng, radius, denomination, fetchProfiles]);

  // 4. Mettre à jour les marqueurs sur la carte Leaflet
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;

    // Vider les marqueurs précédents
    markersGroup.clearLayers();

    // Mettre à jour le cercle de radar
    if (circleLayerRef.current) {
      circleLayerRef.current.remove();
      circleLayerRef.current = null;
    }

    if (radius > 0) {
      const circle = L.circle([center.lat, center.lng], {
        radius: radius * 1000,
        color: '#C9A84C',
        fillColor: '#C9A84C',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 8',
      }).addTo(map);
      circleLayerRef.current = circle;
    }

    // Mettre à jour le marqueur central
    if (centerMarkerRef.current) {
      centerMarkerRef.current.setLatLng([center.lat, center.lng]);
    }

    // Ajouter chaque profil comme épingle luxueuse
    profiles.forEach((profile) => {
      const isSelected = selectedProfile?.id === profile.id;
      const isLiked = likedProfiles.has(profile.id);

      const avatarSrc = profile.avatar ? getMediaUrl(profile.avatar) : null;
      const initials = profile.first_name.slice(0, 2).toUpperCase();

      const customIcon = L.divIcon({
        className: 'gsd-candidate-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer select-none transition-transform duration-300 ${
            isSelected ? 'scale-125 z-50' : 'hover:scale-110'
          }">
            <!-- Halo doré animé si haute compatibilité -->
            ${
              profile.compatibility >= 88
                ? '<div class="absolute -inset-1.5 rounded-full bg-[#C9A84C]/40 animate-pulse"></div>'
                : ''
            }
            
            <!-- Anneau extérieur or & marine -->
            <div class="relative w-11 h-11 rounded-full p-[2px] ${
              isSelected
                ? 'bg-gradient-to-tr from-[#C9A84C] via-amber-300 to-white shadow-xl shadow-[#C9A84C]/50'
                : 'bg-gradient-to-tr from-[#1A3A5C] via-[#C9A84C] to-[#1A3A5C] shadow-md shadow-[#1A3A5C]/30'
            }">
              <div class="w-full h-full rounded-full overflow-hidden bg-[#1A3A5C] flex items-center justify-center text-white font-bold text-xs">
                ${
                  avatarSrc
                    ? `<img src="${avatarSrc}" alt="${profile.first_name}" class="w-full h-full object-cover" />`
                    : `<span>${initials}</span>`
                }
              </div>
            </div>

            <!-- Badge Compatibilité -->
            <div class="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full font-bold text-[9px] shadow-md border border-white/50 text-white ${
              profile.compatibility >= 90
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                : profile.compatibility >= 80
                ? 'bg-gradient-to-r from-amber-600 to-[#C9A84C]'
                : 'bg-gradient-to-r from-slate-600 to-slate-500'
            }">
              ${profile.compatibility}%
            </div>

            <!-- Badge Distance -->
            <div class="absolute -bottom-2.5 bg-[#1A3A5C] text-[#C9A84C] font-semibold text-[8px] px-1.5 py-0.5 rounded-full shadow border border-[#C9A84C]/40 whitespace-nowrap">
              ${profile.distance_km < 1 ? '< 1 km' : `${Math.round(profile.distance_km)} km`}
            </div>

            <!-- Cœur si déjà aimé -->
            ${
              isLiked
                ? '<div class="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] shadow">♥</div>'
                : ''
            }
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([profile.latitude, profile.longitude], {
        icon: customIcon,
      }).addTo(markersGroup);

      marker.on('click', () => {
        setSelectedProfile(profile);
        // Centrage fluide vers le profil
        map.panTo([profile.latitude, profile.longitude], { animate: true });
      });
    });
  }, [profiles, selectedProfile, likedProfiles, center.lat, center.lng, radius]);

  // 5. Recherche avec autocomplétion Geoapify
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          searchQuery
        )}&lang=fr&limit=5&apiKey=${GEOAPIFY_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.features) {
          setSuggestions(data.features);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Geoapify autocomplete error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sélectionner un résultat de recherche
  const handleSelectLocation = (feature: any) => {
    const [lon, lat] = feature.geometry.coordinates;
    const name = feature.properties.city || feature.properties.formatted || feature.properties.name;
    setCenter({ lat, lng: lon });
    setCityName(name);
    setShowSuggestions(false);
    setSearchQuery(name);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], 12, { duration: 1.2 });
    }
  };

  // Téléportation vers une ville prédéfinie
  const handlePresetCity = (city: typeof PRESET_CITIES[0]) => {
    setCenter({ lat: city.lat, lng: city.lng });
    setCityName(city.name);
    setSearchQuery('');
    setShowSuggestions(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([city.lat, city.lng], 12, { duration: 1.2 });
    }
  };

  // Géolocalisation de l'appareil (GPS)
  const handleCurrentGPS = () => {
    if (!navigator.geolocation) {
      toast.error('La géolocalisation n’est pas supportée par votre navigateur.');
      return;
    }

    toast.info('Localisation de votre position en cours...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter({ lat, lng });
        setCityName('Ma position actuelle');
        setSearchQuery('');

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.2 });
        }
        toast.success('Radar centré sur votre position avec succès !');
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        toast.error('Impossible d’accéder au GPS. Veuillez autoriser la localisation.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Action Liker / Prier ensemble directement depuis la carte
  const handleLikeProfile = async (profile: MapProfile) => {
    try {
      const res = await api.post('/api/matchmaking/action/', {
        target_user_id: profile.id,
        action: 'LIKE',
      });

      setLikedProfiles((prev) => new Set(prev).add(profile.id));

      if (res.data.is_match) {
        toast.success(`C'est une Affinité Divine avec ${profile.first_name} ! 💖`);
        if (onMutualMatch) {
          onMutualMatch(
            {
              id: profile.id,
              first_name: profile.first_name,
              city: profile.city,
              avatar: profile.avatar,
              compatibility: profile.compatibility,
            },
            res.data.match_id
          );
        }
      } else {
        toast.success(`Intérêt spirituel transmis à ${profile.first_name}. Que Dieu guide vos pas !`);
      }
    } catch (err: any) {
      console.error('Like error:', err);
      toast.error('Action non effectuée. Veuillez réessayer.');
    }
  };

  // Contrôles Zoom personnalisés
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* 1. BARRE DE COMMANDE & EXPLORATION */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFECE6] shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#C9A84C]/15 text-[#C9A84C]">
                <Compass size={20} />
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1A3A5C]">
                Radar Cartographique Divin
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Explorez les célibataires chrétiens en communion autour de{' '}
              <strong className="text-[#1A3A5C]">{cityName}</strong> ({profiles.length} âmes trouvées)
            </p>
          </div>

          {/* Recherche & GPS */}
          <div className="relative flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Chercher une ville (Douala, Paris, Abidjan...)"
                className="w-full pl-9 pr-8 py-2.5 bg-[#FAF9F6] border border-[#EFECE6] rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}

              {/* Suggestions Geoapify Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#EFECE6] shadow-xl z-50 overflow-hidden py-1 max-h-60 overflow-y-auto">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectLocation(item)}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#FAF9F6] transition-colors flex items-center gap-2.5 border-b border-gray-50 last:border-b-0"
                    >
                      <MapPin size={15} className="text-[#C9A84C] flex-shrink-0" />
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-[#1A3A5C] truncate">
                          {item.properties.city || item.properties.name || item.properties.formatted}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">
                          {item.properties.country || item.properties.formatted}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton GPS */}
            <button
              onClick={handleCurrentGPS}
              title="Utiliser ma position GPS"
              className="p-2.5 bg-[#FAF9F6] hover:bg-[#1A3A5C] text-gray-600 hover:text-white rounded-full border border-[#EFECE6] transition-all shadow-sm flex items-center justify-center flex-shrink-0"
            >
              <Navigation size={16} />
            </button>

            {/* Bouton Filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-full border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                showFilters || denomination !== 'ALL'
                  ? 'bg-[#1A3A5C] text-white border-[#1A3A5C]'
                  : 'bg-[#FAF9F6] text-gray-700 border-[#EFECE6] hover:border-[#C9A84C]'
              }`}
            >
              <Filter size={15} />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
        </div>

        {/* Villes rapides */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mr-1 flex-shrink-0">
            Escales :
          </span>
          {PRESET_CITIES.map((c) => (
            <button
              key={c.name}
              onClick={() => handlePresetCity(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                cityName.toLowerCase().includes(c.name.toLowerCase())
                  ? 'bg-[#C9A84C] text-white shadow-sm font-semibold'
                  : 'bg-[#FAF9F6] text-gray-600 hover:bg-gray-100 border border-[#EFECE6]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* FILTRES DÉPLIABLES */}
        {showFilters && (
          <div className="pt-3 border-t border-[#EFECE6] flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
            {/* Rayon */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#1A3A5C]">Rayon :</span>
              <div className="flex flex-wrap gap-1">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setRadius(r.value)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      radius === r.value
                        ? 'bg-[#1A3A5C] text-white shadow-sm'
                        : 'bg-[#FAF9F6] text-gray-600 hover:bg-gray-100 border border-[#EFECE6]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Confession */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#1A3A5C]">Confession :</span>
              <select
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                className="bg-[#FAF9F6] border border-[#EFECE6] rounded-xl px-3 py-1.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#C9A84C]"
              >
                {DENOMINATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Thème Cartographique Geoapify */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#1A3A5C]">Style de Carte :</span>
              <div className="flex rounded-lg overflow-hidden border border-[#EFECE6]">
                <button
                  onClick={() => setMapStyle('osm-bright')}
                  className={`px-3 py-1 text-[11px] font-semibold transition-all ${
                    mapStyle === 'osm-bright'
                      ? 'bg-[#C9A84C] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Clair Éclatant
                </button>
                <button
                  onClick={() => setMapStyle('positron')}
                  className={`px-3 py-1 text-[11px] font-semibold transition-all ${
                    mapStyle === 'positron'
                      ? 'bg-[#C9A84C] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Minimaliste Ivoire
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. ZONE CARTE & FICHE FLOTTANTE */}
      <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-[#EFECE6] shadow-lg bg-[#FAF9F6]">
        {/* Container Leaflet */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Boutons Zoom Leaflet Stylisés */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-[#EFECE6] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white flex items-center justify-center shadow-md transition-all"
            title="Zoomer"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-[#EFECE6] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white flex items-center justify-center shadow-md transition-all"
            title="Dézoomer"
          >
            <ZoomOut size={16} />
          </button>
        </div>

        {/* Indicateur de chargement */}
        {loading && (
          <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#EFECE6] shadow-md flex items-center gap-2">
            <RefreshCw size={14} className="text-[#C9A84C] animate-spin" />
            <span className="text-xs font-semibold text-[#1A3A5C]">
              Scan des cœurs dans le radar...
            </span>
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && profiles.length === 0 && (
          <div className="absolute inset-x-4 top-20 max-w-sm mx-auto z-20 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#EFECE6] shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center mx-auto mb-3">
              <Compass size={24} />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1A3A5C] mb-1">
              Aucun profil dans ce rayon
            </h4>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Élargissez votre recherche géographique ou modifiez les filtres de confession pour
              trouver davantage d'âmes sœurs.
            </p>
            <button
              onClick={() => setRadius(150)}
              className="px-4 py-2 bg-[#1A3A5C] text-white text-xs font-semibold rounded-full hover:bg-[#132c45] transition-all shadow-sm"
            >
              Élargir à 150 km
            </button>
          </div>
        )}

        {/* CARTE FLOTTANTE DU CANDIDAT SÉLECTIONNÉ */}
        {selectedProfile && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20 bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-[#C9A84C]/40 shadow-2xl animate-slide-up flex flex-col gap-3">
            {/* Header Profil */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border-2 border-[#C9A84C] flex-shrink-0 shadow">
                  {selectedProfile.avatar ? (
                    <img
                      src={getMediaUrl(selectedProfile.avatar)}
                      alt={selectedProfile.first_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1A3A5C] text-white font-bold text-lg flex items-center justify-center">
                      {selectedProfile.first_name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  {selectedProfile.kyc_verified && (
                    <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                      <ShieldCheck size={10} />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-base text-[#1A3A5C]">
                      {selectedProfile.first_name}, {selectedProfile.age}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#C9A84C] font-medium mt-0.5">
                    <MapPin size={12} />
                    <span>
                      {selectedProfile.city} • à{' '}
                      {selectedProfile.distance_km < 1
                        ? '< 1 km'
                        : `${Math.round(selectedProfile.distance_km)} km`}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedProfile(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Badges Foi & Profession */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2.5 py-1 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] font-semibold flex items-center gap-1">
                <Church size={12} className="text-[#C9A84C]" />
                {selectedProfile.denomination}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-1">
                <Sparkles size={12} className="text-emerald-600" />
                {selectedProfile.compatibility}% d'affinité
              </span>
              {selectedProfile.profession && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                  <Briefcase size={12} className="text-gray-500" />
                  {selectedProfile.profession}
                </span>
              )}
            </div>

            {/* Citation Vision du Mariage */}
            {selectedProfile.marriage_vision && (
              <p className="text-xs text-gray-600 italic border-l-2 border-[#C9A84C] pl-2.5 py-0.5 leading-relaxed line-clamp-2">
                « {selectedProfile.marriage_vision} »
              </p>
            )}

            {/* Décomposition d'affinité spirituelle */}
            {selectedProfile.breakdown && (
              <div className="space-y-1 pt-1 border-t border-gray-100 text-[10px]">
                <div className="flex justify-between text-gray-500">
                  <span>Harmonie spirituelle & doctrine :</span>
                  <span className="font-bold text-[#1A3A5C]">
                    {selectedProfile.breakdown.faith || 85}%
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A84C] rounded-full"
                    style={{ width: `${selectedProfile.breakdown.faith || 85}%` }}
                  />
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleLikeProfile(selectedProfile)}
                disabled={likedProfiles.has(selectedProfile.id)}
                className={`flex-1 py-2.5 px-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all ${
                  likedProfiles.has(selectedProfile.id)
                    ? 'bg-rose-100 text-rose-600 cursor-default'
                    : 'bg-[#1A3A5C] text-white hover:bg-[#132c45] active:scale-95'
                }`}
              >
                <Heart
                  size={15}
                  className={likedProfiles.has(selectedProfile.id) ? 'fill-current' : ''}
                />
                <span>
                  {likedProfiles.has(selectedProfile.id) ? 'Intérêt transmis' : 'Prier ensemble'}
                </span>
              </button>

              {onSelectCandidate && (
                <button
                  onClick={() => onSelectCandidate(selectedProfile.id)}
                  className="p-2.5 rounded-full border border-[#EFECE6] bg-[#FAF9F6] text-[#1A3A5C] hover:bg-gray-100 transition-all flex items-center justify-center"
                  title="Voir le profil détaillé"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchMapDiscovery;
