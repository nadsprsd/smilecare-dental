// lib/doctors.ts
//
// Real roster from Vee Care Dental Clinic. Vineeth and Anumuthu are the
// full-time team — confirmed by the clinic (Aug 2026) as always bookable,
// for every service, so patients are never shown "no doctor available."
// The other 6 are on-call specialists, each tied to their own specialty,
// only bookable on days they're marked Active on the Roster page.
// Everything here is plain data — edit directly, no other code changes needed.

export type DoctorType = "full-time" | "on-call";

export interface Doctor {
  id: string;            // stable slug, used as the DB key — don't change once bookings exist
  name: string;
  degree: string;
  specialty: string;
  type: DoctorType;
  services: string[];    // must match entries in SERVICES below
  bio?: string;          // full professional bio, shown on the Doctors page when present
  photo?: string;        // path under /public, e.g. "/doctors/vineeth.jpg" — falls back to a generic icon when absent
}

export const SERVICES = [
  "General Dentistry",
  "Root Canal Treatment",
  "Teeth Cleaning",
  "Tooth Filling",
  "Tooth Extractions",
  "Braces and Aligners",
  "Dental Implants",
  "Smile Correction",
  "Teeth Whitening",
  "Crown and Bridges",
  "Veneers",
  "Fixed and Removable Dentures",
  "Pediatric Dentistry",
  "Gum Care",
  "Laser Dentistry",
] as const;

export const DOCTORS: Doctor[] = [
  {
    id: "vineeth",
    name: "Dr. Vineeth N.H",
    degree: "BDS, MDS",
    specialty: "Chief Dental Surgeon & Endodontist (Root Canal Specialist)",
    type: "full-time", // clinic's stated lead — confident on this one
    services: [...SERVICES], // always bookable, every service — clinic's explicit instruction (Aug 2026)
    photo: "/doctors/vineeth.jpg",
    bio: "Dr. Vineeth N.H. is a dedicated and accomplished Consultant Endodontist with advanced postgraduate training and extensive clinical experience in Root Canal Treatment and Endodontic Care. He completed his BDS from Government Dental College, Kozhikode (Calicut), followed by his MDS from Mar Baselios Dental College. With a strong focus on preserving natural teeth, Dr. Vineeth combines meticulous clinical assessment, precise treatment planning, and modern endodontic principles to provide predictable and comfortable treatment outcomes. He has served as a Consultant Endodontist at Indira Gandhi Hospital, Ernakulam; A.P. Varkey Hospital, Arakkunnam; JMP Hospital, Piravom; and Kunjalus Hospital, Ernakulam, in addition to providing specialist endodontic care across several dental clinics in Ernakulam and Kottayam. Dr. Vineeth believes that successful endodontic treatment is not only about relieving dental pain but also about preserving the patient's natural tooth and restoring long-term oral health.",
  },
  {
    id: "anumuthu",
    name: "Dr. Anumuthu P M",
    degree: "BDS",
    specialty: "Resident Dental Surgeon",
    type: "full-time", // guess — residents are typically on-site daily; please confirm
    services: [...SERVICES], // always bookable, every service — clinic's explicit instruction (Aug 2026)
    photo: "/doctors/anumuthu.jpg",
    bio: "Dr. Anumuthu P.M. is a dedicated and patient-focused General Dentist with clinical experience in preventive, restorative, periodontal, and minor surgical dental care. He completed his Bachelor of Dental Surgery (BDS) from Government Dental College, Kottayam, and gained extensive hands-on experience during his clinical internship and subsequent practice in multispecialty dental clinics. He provides comprehensive dental care for pediatric, adult, and geriatric patients, with a strong focus on accurate diagnosis, individualized treatment planning, patient education, and preventive oral healthcare. Dr. Anumuthu believes in compassionate, comfortable, and evidence-based dental care while continuously developing his clinical knowledge and skills.",
  },
  {
    id: "reshma",
    name: "Dr. Reshma R",
    degree: "MBBS, MS",
    specialty: "General Surgeon",
    type: "on-call",
    services: ["Tooth Extractions"], // guess — likely surgical support/clearance, please confirm her actual bookable role
    photo: "/doctors/reshma.jpg",
    bio: "Dr. Reshma R is a General Surgeon in Ernakulam with 4 years of experience in the field. She completed her MBBS from Malabar Medical College in 2019, her MS in General Surgery from Government Medical College, Nanded in 2026, and her Senior Residency at KEM Hospital, Mumbai.",
  },
  {
    id: "arun-george",
    name: "Dr. Arun George",
    degree: "BDS, MDS",
    specialty: "Consultant Orthodontist, Braces & Clear Aligners",
    type: "on-call",
    services: ["Braces and Aligners"],
    photo: "/doctors/arun-george.jpg",
    bio: "Dr. Arun George is a qualified Orthodontist dedicated to providing comprehensive, personalized orthodontic care focused on dental health, facial harmony, and confident smiles. With an MDS in Orthodontics, he specializes in the diagnosis and management of dental and skeletal alignment problems using contemporary orthodontic and dentofacial orthopaedic techniques. His clinical expertise includes fixed orthodontic braces, aesthetic orthodontic appliances, clear aligner therapy, and dentofacial orthopaedic treatment for growing children and adolescents. He provides individualized treatment plans aimed at guiding jaw growth, correcting developing bite problems, improving facial balance, and achieving optimal dental alignment. Dr. Arun follows a patient-centred approach, combining careful diagnosis, evidence-based treatment planning, and meticulous clinical care.",
  },
  {
    id: "mathew",
    name: "Dr. Mathew Joseph Thuruthel",
    degree: "BDS, MDS (Oral & Maxillofacial Surgery)",
    specialty: "Oral & Maxillofacial Surgeon, Assistant Professor at Amrita School of Dentistry",
    type: "on-call",
    services: ["Tooth Extractions", "Dental Implants"],
    photo: "/doctors/mathew.jpg",
    bio: "Dr. Mathew Joseph Thuruthel is a highly qualified Oral & Maxillofacial Surgeon and Assistant Professor at Amrita School of Dentistry, Kochi, dedicated to providing precise, comprehensive, and patient-centered surgical care. He completed his BDS from Army College of Dental Sciences, Secunderabad, followed by an MDS in Oral & Maxillofacial Surgery from PMS College of Dental Science & Research, Trivandrum. He has also earned the MFD RCSI from the Royal College of Surgeons in Ireland and MFDS RCPSG from the Royal College of Physicians & Surgeons of Glasgow. His academic accomplishments include securing 1st rank in the MDS examination in Oral & Maxillofacial Surgery under Kerala University of Health Sciences (KUHS), and he has been awarded a Fellowship from the Global College of Oral Implantologists (GCOI). He has contributed to multiple scientific publications, including PubMed-indexed research, reflecting his dedication to evidence-based dentistry.",
  },
  {
    id: "nithin",
    name: "Dr. Nithin",
    degree: "BDS, MDS",
    specialty: "Oral & Maxillofacial Surgeon",
    type: "on-call",
    services: ["Tooth Extractions", "Dental Implants"],
    photo: "/doctors/nithin.jpg",
  },
  {
    id: "sreeja",
    name: "Dr. Sreeja K. Nanukuttan",
    degree: "BDS, MDS",
    specialty: "Consultant Prosthodontist & Implantologist",
    type: "on-call",
    services: ["Crown and Bridges", "Veneers", "Fixed and Removable Dentures", "Smile Correction", "Dental Implants"],
    photo: "/doctors/sreeja.jpg",
    bio: "Dr. Sreeja K. Nanukuttan is a highly experienced Prosthodontist and Implantologist with more than 12 years of clinical experience in restorative dentistry, prosthodontics, implantology, cosmetic dentistry, and maxillofacial prosthetic rehabilitation. She completed her BDS from Annoor Dental College, Muvattupuzha, and MDS in Prosthodontics & Implantology from Government Dental College, Kottayam. Over the years, she has developed extensive expertise in comprehensive treatment planning, full-mouth rehabilitation, fixed and removable prosthodontics, implant-supported restorations, aesthetic dentistry, and complex restorative cases. Her areas of expertise include dental implants and implant prosthetics, full-mouth rehabilitation, crowns and bridges, complete and partial dentures, smile design, laminate veneers, implant-supported overdentures, and maxillofacial prosthetics.",
  },
  {
    id: "akhil",
    name: "Dr. Akhil S",
    degree: "BDS, MDS",
    specialty: "Prosthodontist & Implantologist",
    type: "on-call",
    services: ["Dental Implants", "Crown and Bridges", "Veneers", "Fixed and Removable Dentures"],
    photo: "/doctors/akhil.jpg",
    bio: "Dr. Akhil S. is a skilled Prosthodontist and Implantologist dedicated to providing comprehensive dental care with a special focus on restorative, prosthetic, and implant dentistry. He completed his BDS from Government Dental College, Kozhikode, Kerala, followed by his MDS from Government Dental College, Kolkata, West Bengal. With experience in both general dentistry and specialized prosthodontic practice, Dr. Akhil provides a wide range of treatments, from routine dental care to advanced prosthetic rehabilitation and implant-supported restorations, including complete and removable partial dentures, crowns and bridges, veneers, full mouth rehabilitation, and comprehensive prosthetic care. His goal is to help patients regain not only oral function but also confidence through personalized prosthodontic and implant treatment.",
  },
];

// Clinic operating hours — used to generate bookable time slots.
// Real hours per the clinic: Mon–Sat 10am–8pm, Sunday 10am–4pm.
export const CLINIC_HOURS: Record<number, { open: string; close: string } | null> = {
  0: { open: "10:00", close: "16:00" }, // Sunday
  1: { open: "10:00", close: "20:00" },
  2: { open: "10:00", close: "20:00" },
  3: { open: "10:00", close: "20:00" },
  4: { open: "10:00", close: "20:00" },
  5: { open: "10:00", close: "20:00" },
  6: { open: "10:00", close: "20:00" },
};

export const SLOT_MINUTES = 30;

export function getDoctorById(id: string): Doctor | undefined {
  return DOCTORS.find(d => d.id === id);
}

export function doctorsForService(service: string): Doctor[] {
  return DOCTORS.filter(d => d.services.includes(service));
}

// Generates every slot start-time string ("10:00", "10:30", ...) for a given weekday.
export function generateSlotsForDay(dayOfWeek: number): string[] {
  const hours = CLINIC_HOURS[dayOfWeek];
  if (!hours) return [];
  const slots: string[] = [];
  let [h, m] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);
  while (h < closeH || (h === closeH && m < closeM)) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += SLOT_MINUTES;
    if (m >= 60) { m -= 60; h += 1; }
  }
  return slots;
}
