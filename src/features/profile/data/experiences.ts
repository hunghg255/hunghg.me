import type { Experience } from "../types/experiences";

export const EXPERIENCES: Experience[] = [
  {
    id: "agile",
    companyName: "AgileTech Vietnam",
    companyLogo: "/images/agile.png",
    positions: [
      {
        id: "20f8bfe5-b6a3-4b0d-ac2f-6fccd50d417e",
        title: "Frontend Developer",
        employmentPeriod: {
          start: "01.2023",
        },
        employmentType: "Full-time",
        icon: "code",
        description: `- Worked on developing and maintaining the projects of the company.
- Training intern members of the company.`,
        skills: [
          "TypeScript",
          "React",
          "Next.js",
          "Tailwind CSS",
          "Agile",
          "Teamwork",
          "Research",
          "Problem-solving",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "beau",
    companyName: "Beau Agency Vietnam",
    companyLogo: "/images/beau.jpg",
    positions: [
      {
        id: "30d3a9fb-021d-452a-9d27-83655369b4b9",
        title: "Frontend Developer Intern",
        employmentPeriod: {
          start: "09.2019",
        },
        employmentType: "full-time",
        icon: "code",
        description: `- Worked on developing and maintaining the company's e-commerce, landing page website
- Developed and maintained the project on shopify platform.`,
        skills: [
          "React",
          "Next.js",
          "Strapi",
          "Auth0",
          "Docker",
          "NGINX",
          "Docusaurus",
          "Extension",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: false,
  },
  {
    id: "open-source",
    companyName: "Github",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    positions: [
      {
        id: "f0becfba-057d-40db-b252-739e1654faa1",
        title: "OSS Developer",
        employmentPeriod: {
          start: "2023",
        },
        employmentType: "Part-time",
        description: `- Contributed to a few popular projects.
- Build a few small libraries to help improve the development frontend process.
- All Projects: https://npmstat.hunghg.me/`,
        icon: "code",
        skills: [
          "React",
          "Next.js",
          "Strapi",
          "Auth0",
          "Docker",
          "NGINX",
          "Docusaurus",
          "Extension",
        ],
      },
    ],
    isCurrentEmployer: true,
  },

  {
    id: "education",
    companyName: "Education",
    positions: [
      {
        id: "c47f5903-88ae-4512-8a50-0b91b0cf99b6",
        title: "Ha Noi University of Science and Technology - HUST",
        employmentPeriod: {
          start: "08.2015",
          end: "2020",
        },
        icon: "education",
        description: `- Currently studying for a Bachelor's degree in Information Systems.
- Language Proficiency: B1 English Level.`,
        skills: [
          "C++",
          "Java",
          "Python",
          "Data Structures",
          "Algorithms",
          "Advanced Databases",
          "Systems Design",
          "Distributed Systems",
          "Software Engineering",
          "Self-learning",
          "Teamwork",
          "Presentation",
        ],
      },
    ],
  },
];
