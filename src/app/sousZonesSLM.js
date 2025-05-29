// Données des sous-zones pour SLM (extraites du HTML d'origine)
export const sousZonesSLM = [
  {
    name: "A1",
    color: "red",
    collecte: {
      encombrants: "Mardi 02 Novembre (1er MARDI du mois)",
      verts: "Mercredi 03 Novembre (1er MERCREDI du mois)",
      opacity: 0.3,
    },
    lieux: [
      { nom: "Chandon", coord: [5.504496155191266, -54.03048410030026] },
      { nom: "Les Cultures", coord: [5.503562310807634, -54.028787351439064] },
      { nom: "Marinas", coord: [5.506649, -54.024784] },
    ],
  },
  {
    name: "A2",
    color: "red",
    collecte: {
      encombrants: "Jeudi 04 Novembre (1er JEUDI du mois)",
      verts: "Mercredi 03 Novembre (1er MERCREDI du mois)",
      opacity: 0.3,
    },
    lieux: [
      { nom: "Schœlcher", coord: [5.502044131975302, -54.030517911478825] },
      { nom: "Carnot", coord: [5.505123935309586, -54.02697642164512] },
    ],
  },
  {
    name: "B1",
    color: "red",
    collecte: {
      encombrants: "Mardi 09 Novembre (2ème MARDI du mois)",
      verts: "Mercredi 10 Novembre (2ème MERCREDI du mois)",
      opacity: 0.3,
    },
    lieux: [
      { nom: "Rousseau", coord: [5.501110244689081, -54.029903831636936] },
      { nom: "Guynemer", coord: [5.499579248740663, -54.032281946585684] },
    ],
  },
  {
    name: "B2",
    color: "red",
    collecte: {
      encombrants: "Jeudi 11 Novembre (2ème JEUDI du mois)",
      verts: "Mercredi 10 Novembre (2ème MERCREDI du mois)",
      opacity: 0.3,
    },
    lieux: [
      { nom: "Symphorien", coord: [5.476786516433601, -54.02984013124319] },
      { nom: "Vill. Chinois", coord: [5.499984365587829, -54.0333694758162] },
    ],
  },
  {
    name: "C1",
    color: "red",
    collecte: {
      encombrants: "Mardi 16 Novembre (3ème MARDI du mois)",
      verts: "Mercredi 10 Novembre (2ème MERCREDI du mois)",
      opacity: 0.3,
    },
    lieux: [
      { nom: "Les Rivages", coord: [5.490289499999999, -54.03817959999999] },
      { nom: "Haut Balaté", coord: [5.482488342504767, -54.0422996619811] },
    ],
  },
  {
    name: "C2",
    color: "red",
    collecte: {
      encombrants: "Mardi 16 Novembre (3ème MARDI du mois)",
      verts: "Mercredi 10 Novembre (2ème MERCREDI du mois)",
      opacity: 0.3,
    },
    lieux: [
      { nom: "La Charbonnière", coord: [5.490460354121421, -54.0382547330934] },
      { nom: "Village Balaté", coord: [5.490289499999999, -54.03817959999999] },
    ],
  },
  {
    name: "C3",
    color: "red",
    collecte: {
      encombrants: "Mercredi 17 Novembre (3ème MERCREDI du mois)",
      verts: "Pas de collecte",
      opacity: 0.3,
    },
    lieux: [
      {
        nom: "Village terre rouge",
        coord: [5.448113948151249, -54.0431213971517],
      },
      { nom: "V. Espérance", coord: [5.490289499999999, -54.03817959999999] },
    ],
  },
  {
    name: "C4",
    color: "red",
    collecte: {
      encombrants: "Jeudi 18 Novembre (3ème JEUDI du mois)",
      verts: "Mercredi 10 Novembre (2ème MERCREDI du mois)",
      opacity: 0.3,
    },
    lieux: [
      { nom: "Lot. Moucaya", coord: [5.48328, -54.0428] },
      {
        nom: "Av. Ch. Colomb jusqu'à St Louis",
        coord: [5.492455256531381, -54.031626164872655],
      },
    ],
  },
  {
    name: "D1",
    color: "red",
    collecte: {
      encombrants: "Mardi 23 Novembre (4ème MARDI du mois)",
      verts: "Mercredi 24 Novembre (4ème MERCREDI du mois)",
      opacity: 0.3,
    },
    lieux: [
      { nom: "Lac Bleu", coord: [5.4719438, -54.0352681] },
      { nom: "Puits Gallot", coord: [5.4879696, -54.0297111] },
    ],
  },
  {
    name: "D2",
    color: "red",
    collecte: {
      encombrants: "Jeudi 25 Novembre (4ème JEUDI du mois)",
      verts: "Mercredi 24 Novembre (4ème MERCREDI du mois)",
      opacity: 0.3,
    },
    lieux: [
      { nom: "Lot. Les Ecoles", coord: [5.4879696, -54.0297111] },
      { nom: "Maryflore", coord: [5.4719438, -54.0352681] },
      { nom: "Rte de St-Maurice", coord: [5.4879696, -54.0297111] },
      { nom: "Amapa 1 et 3", coord: [5.4856825, -54.0181574] },
      { nom: "Lac Bleu", coord: [5.4719438, -54.0352681] },
    ],
  },
];

export const slmVilleGeojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Saint-Laurent-du-Maroni (ville)" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-54.013837207389244, 5.511957978505066],
            [-54.012842422153, 5.51096660075099],
            [-54.02377595076858, 5.511022232736451],
            [-54.03489081783944, 5.506260924274841],
            [-54.05049117559348, 5.477562254984889],
            [-54.054330210999055, 5.447195023824804],
            [-54.01993273058761, 5.438374723613649],
            [-53.988108012433585, 5.503401879396279],
            [-54.013837207389244, 5.511957978505066],
          ],
        ],
      },
    },
  ],
};
