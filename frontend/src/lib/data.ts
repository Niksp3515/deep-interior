import kitchenImg from "@/assets/design-kitchen.jpg";
import bedroomImg from "@/assets/design-bedroom.jpg";
import officeImg from "@/assets/design-office.jpg";
import bathroomImg from "@/assets/design-bathroom.jpg";
import livingImg from "@/assets/design-living.jpg";

export type RoomCategory = "Living Room" | "Kitchen" | "Bedroom" | "Bathroom" | "Dining Area" | "Office Space";
export type MediaStage = "3d_design" | "real_project";
export type MediaType = "image" | "video" | "render";

export type Location = "Ahmedabad" | "Gandhinagar" | "Surat" | "Vadodara";

export interface ProjectMedia {
  id: string;
  mediaType: MediaType;
  mediaUrl: string;
  mediaStage: MediaStage;
  caption?: string;
}

export interface ProjectCategory {
  id: string;
  categoryName: RoomCategory;
  media: ProjectMedia[];
}

export interface Project {
  id: string;
  title: string;
  location: Location;
  description: string;
  coverImage: string;
  completionYear: number;
  categories: ProjectCategory[];
}

export interface Review {
  id: string;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  date: string;
  profile_photo_url?: string | null;
}

export const locations: Location[] = ["Ahmedabad", "Gandhinagar", "Surat", "Vadodara"];

export const roomCategories: RoomCategory[] = [
  "Living Room",
  "Kitchen",
  "Bedroom",
  "Bathroom",
  "Dining Area",
  "Office Space",
];

export const projects: Project[] = [
  {
    id: "p1",
    title: "Vatva Office",
    location: "Ahmedabad",
    description:
      "A modern office space designed with functional layouts, professional aesthetics, and optimized work environments in the Vatva industrial area of Ahmedabad.",
    coverImage: officeImg,
    completionYear: 2024,
    categories: [
      {
        id: "p1c1",
        categoryName: "Office Space",
        media: [
          { id: "m1", mediaType: "render", mediaUrl: officeImg, mediaStage: "3d_design", caption: "3D concept — open office layout" },
          { id: "m2", mediaType: "image", mediaUrl: officeImg, mediaStage: "real_project", caption: "Completed office with modern finishes" },
        ],
      },
      {
        id: "p1c2",
        categoryName: "Kitchen",
        media: [
          { id: "m3", mediaType: "render", mediaUrl: kitchenImg, mediaStage: "3d_design", caption: "Office pantry 3D render" },
          { id: "m4", mediaType: "image", mediaUrl: kitchenImg, mediaStage: "real_project", caption: "Completed pantry area" },
        ],
      },
    ],
  },
  {
    id: "p2",
    title: "Pipli Residence",
    location: "Gandhinagar",
    description:
      "A beautiful residential interior project in Pipli featuring contemporary design elements, warm tones, and thoughtfully planned living spaces.",
    coverImage: livingImg,
    completionYear: 2024,
    categories: [
      {
        id: "p2c1",
        categoryName: "Living Room",
        media: [
          { id: "m5", mediaType: "render", mediaUrl: livingImg, mediaStage: "3d_design", caption: "Living area 3D visualization" },
          { id: "m6", mediaType: "image", mediaUrl: livingImg, mediaStage: "real_project", caption: "Completed living space" },
        ],
      },
      {
        id: "p2c2",
        categoryName: "Bedroom",
        media: [
          { id: "m7", mediaType: "render", mediaUrl: bedroomImg, mediaStage: "3d_design", caption: "Master bedroom concept" },
          { id: "m8", mediaType: "image", mediaUrl: bedroomImg, mediaStage: "real_project", caption: "Finished master bedroom" },
        ],
      },
      {
        id: "p2c3",
        categoryName: "Kitchen",
        media: [
          { id: "m9", mediaType: "render", mediaUrl: kitchenImg, mediaStage: "3d_design", caption: "Kitchen 3D render" },
          { id: "m10", mediaType: "image", mediaUrl: kitchenImg, mediaStage: "real_project", caption: "Completed modular kitchen" },
        ],
      },
    ],
  },
  {
    id: "p3",
    title: "Kadi Bungalow",
    location: "Gandhinagar",
    description:
      "A spacious bungalow interior in Kadi with elegant room designs, custom furniture, and premium material finishes throughout every living area.",
    coverImage: bedroomImg,
    completionYear: 2025,
    categories: [
      {
        id: "p3c1",
        categoryName: "Living Room",
        media: [
          { id: "m11", mediaType: "render", mediaUrl: livingImg, mediaStage: "3d_design", caption: "Bungalow living 3D plan" },
          { id: "m12", mediaType: "image", mediaUrl: livingImg, mediaStage: "real_project", caption: "Completed living room" },
        ],
      },
      {
        id: "p3c2",
        categoryName: "Bathroom",
        media: [
          { id: "m13", mediaType: "render", mediaUrl: bathroomImg, mediaStage: "3d_design", caption: "Bathroom 3D concept" },
          { id: "m14", mediaType: "image", mediaUrl: bathroomImg, mediaStage: "real_project", caption: "Finished spa-style bathroom" },
        ],
      },
      {
        id: "p3c3",
        categoryName: "Bedroom",
        media: [
          { id: "m15", mediaType: "render", mediaUrl: bedroomImg, mediaStage: "3d_design", caption: "Guest bedroom concept" },
          { id: "m16", mediaType: "image", mediaUrl: bedroomImg, mediaStage: "real_project", caption: "Guest bedroom — completed" },
        ],
      },
    ],
  },
  {
    id: "p4",
    title: "Isanpur Apartment",
    location: "Ahmedabad",
    description:
      "A modern apartment renovation in Isanpur, Ahmedabad — transforming a standard flat into a stylish, functional home with smart storage and contemporary interiors.",
    coverImage: kitchenImg,
    completionYear: 2024,
    categories: [
      {
        id: "p4c1",
        categoryName: "Kitchen",
        media: [
          { id: "m17", mediaType: "render", mediaUrl: kitchenImg, mediaStage: "3d_design", caption: "Kitchen renovation 3D concept" },
          { id: "m18", mediaType: "image", mediaUrl: kitchenImg, mediaStage: "real_project", caption: "Renovated modular kitchen" },
        ],
      },
      {
        id: "p4c2",
        categoryName: "Living Room",
        media: [
          { id: "m19", mediaType: "render", mediaUrl: livingImg, mediaStage: "3d_design", caption: "Living room 3D visualization" },
          { id: "m20", mediaType: "image", mediaUrl: livingImg, mediaStage: "real_project", caption: "Living area — final result" },
        ],
      },
      {
        id: "p4c3",
        categoryName: "Dining Area",
        media: [
          { id: "m21", mediaType: "render", mediaUrl: kitchenImg, mediaStage: "3d_design", caption: "Dining area 3D layout" },
          { id: "m22", mediaType: "image", mediaUrl: kitchenImg, mediaStage: "real_project", caption: "Dining space — completed" },
        ],
      },
    ],
  },
  {
    id: "p5",
    title: "Bhartbhai Patel Residence",
    location: "Ahmedabad",
    description:
      "A premium residential project for the Patel family in Ahmedabad — featuring luxurious interiors, custom woodwork, and sophisticated design throughout.",
    coverImage: bathroomImg,
    completionYear: 2025,
    categories: [
      {
        id: "p5c1",
        categoryName: "Living Room",
        media: [
          { id: "m23", mediaType: "render", mediaUrl: livingImg, mediaStage: "3d_design", caption: "Living room 3D plan" },
          { id: "m24", mediaType: "image", mediaUrl: livingImg, mediaStage: "real_project", caption: "Completed luxury living room" },
        ],
      },
      {
        id: "p5c2",
        categoryName: "Bathroom",
        media: [
          { id: "m25", mediaType: "render", mediaUrl: bathroomImg, mediaStage: "3d_design", caption: "Bathroom 3D concept" },
          { id: "m26", mediaType: "image", mediaUrl: bathroomImg, mediaStage: "real_project", caption: "Premium bathroom — completed" },
        ],
      },
    ],
  },
  {
    id: "p6",
    title: "Sureshbhai Villa",
    location: "Surat",
    description:
      "A complete villa interior designed for Sureshbhai in Surat — combining traditional Gujarat aesthetics with modern design sensibilities and high-quality materials.",
    coverImage: livingImg,
    completionYear: 2025,
    categories: [
      {
        id: "p6c1",
        categoryName: "Living Room",
        media: [
          { id: "m27", mediaType: "render", mediaUrl: livingImg, mediaStage: "3d_design", caption: "Villa living concept" },
          { id: "m28", mediaType: "image", mediaUrl: livingImg, mediaStage: "real_project", caption: "Completed villa living area" },
        ],
      },
      {
        id: "p6c2",
        categoryName: "Kitchen",
        media: [
          { id: "m29", mediaType: "render", mediaUrl: kitchenImg, mediaStage: "3d_design", caption: "Kitchen 3D render" },
          { id: "m30", mediaType: "image", mediaUrl: kitchenImg, mediaStage: "real_project", caption: "Finished villa kitchen" },
        ],
      },
      {
        id: "p6c3",
        categoryName: "Bedroom",
        media: [
          { id: "m31", mediaType: "render", mediaUrl: bedroomImg, mediaStage: "3d_design", caption: "Bedroom 3D concept" },
          { id: "m32", mediaType: "image", mediaUrl: bedroomImg, mediaStage: "real_project", caption: "Villa bedroom — completed" },
        ],
      },
    ],
  },
];

export const testimonials: Review[] = [
  {
    id: "r1",
    userName: "Rajesh Patel",
    userInitials: "RP",
    rating: 5,
    comment:
      "Deep Interior transformed our home in Ahmedabad beautifully. The 3D designs matched the final result perfectly. Highly professional team.",
    date: "2025-09-20",
  },
  {
    id: "r2",
    userName: "Priya Shah",
    userInitials: "PS",
    rating: 5,
    comment:
      "Excellent renovation work on our office in Vatva. The team understood our requirements and delivered beyond expectations. Truly recommended.",
    date: "2025-11-15",
  },
  {
    id: "r3",
    userName: "Ankit Desai",
    userInitials: "AD",
    rating: 5,
    comment:
      "Our bungalow in Kadi was designed with incredible attention to detail. From concept to completion, Deep Interior made the entire process seamless.",
    date: "2026-01-08",
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectsByLocation(location: Location): Project[] {
  return projects.filter((p) => p.location === location);
}
