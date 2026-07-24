/* Portfolio data model.
   Each section holds one or more "collections" (a project or a group).
   A collection = { title, note, cover, images[] }.
   Loaded as a plain global (PORTFOLIO) so the site works from file:// too. */

const img = (slug, files) => files.map((f) => `images/${slug}/${f}`);

const PORTFOLIO = {
  name: "Pranitha Andra",
  role: "Visual Development · Environment Artist",
  location: "San Jose, CA",
  email: "pranitha.andra@gmail.com",
  instagram: "https://www.instagram.com/pranitha_andra/",
  behance: "https://www.behance.net/pranithaandra",

  sections: [
    {
      id: "visual-development",
      num: "01",
      title: "Visual Development",
      blurb:
        "Story-driven props, characters, and worlds, developing the look, layout, and color of a scene from first sketch to final key.",
      collections: [
        {
          title: "Dream?",
          note: "Visual development",
          headline: "Picking up the spray can to reconnect with her mom and find herself.",
          sub: "Finding her creative spark in the same streets her mom used to paint.",
          cover: "images/dream/01.jpg",
          video: "videos/dream.mp4",
          images: img("dream", [
            "01.jpg", "02.png", "03.png", "04.png", "05.png",
            "06.png", "07.png", "08.png", "09.png",
          ]),
        },
        {
          title: "Heavy Bloom",
          note: "Visual development",
          headline: "Turning the heavy weight of grief into something that actually blooms.",
          sub: "Figuring out how to create again while missing the person who inspired it all.",
          cover: "images/heavy-bloom/03.webp",
          video: "videos/bloom.mp4",
          images: img("heavy-bloom", [
            "01.webp", "02.webp", "03.webp", "04.webp",
            "05.webp", "06.webp", "07.webp", "08.webp",
          ]),
        },
        {
          title: "Corner Stop",
          note: "Visual development",
          headline: "Good coffee, home-cooked food and way too many cats.",
          sub: "The neighborhood's favorite spot, run by a cat-loving grandma who cooks with love.",
          cover: "images/corner-stop/06.webp",
          images: img("corner-stop", [
            "01.webp", "02.webp", "03.webp", "04.webp",
            "05.webp", "06.webp", "07.webp",
          ]),
        },
      ],
    },

    {
      id: "design",
      num: "02",
      title: "Design",
      blurb:
        "Graphic design and branding: layout, type, identity systems, and social from the 2026 design portfolio.",
      collections: [
        {
          title: "2026 Design Portfolio",
          note: "Branding · Layout · Identity",
          cover: "images/design-2026/01.webp",
          images: img("design-2026", [
            "01.webp", "02.webp", "03.webp", "04.webp", "05.webp",
            "06.webp", "07.webp", "08.webp", "09.webp", "10.webp",
          ]),
        },
      ],
    },

    {
      id: "illustrations",
      num: "03",
      title: "Illustrations",
      blurb:
        "Environments, studies, and photobashing: building believable spaces, light, and atmosphere.",
      collections: [
        {
          title: "Illustrations",
          note: "Studies & photobashing",
          cover: "images/film-studies/05.jpg",
          layout: "grid",     // masonry grid viewer + click-to-expand, like Theyyam
          images: [
            "images/portrait-study/01.png",
            "images/portrait-study/02.jpg",
            "images/portrait-study/03.png",
            "images/portrait-study/04.png",
            "images/film-studies/01.jpg",
            "images/film-studies/02.png",
            "images/film-studies/03.jpg",
            "images/film-studies/04.jpg",
            "images/film-studies/05.jpg",
            "images/film-studies/06.jpg",
            "images/film-studies/07.jpg",
            "images/photobashing/01.webp",
            "images/photobashing/02.webp",
            "images/photobashing/03.webp",
          ],
        },
      ],
    },

    {
      id: "film",
      num: "04",
      title: "Film",
      blurb:
        "Concept art for film: developing the world, mood, and color of Theyyam.",
      collections: [
        {
          title: "Theyyam",
          note: "Concept art",
          headline: "Partnering with the director to bring the movie's biggest scene to life.",
          sub: "Crafting the ultimate climax scene alongside the director.",
          cover: "images/concepts/concept-1.jpeg",
          layout: "grid",     // render the viewer as a gallery grid
          cursor: "spark",    // warm sparks instead of ink while this viewer is open
          images: img("concepts", [
            "concept-1.jpeg", "concept-2.jpeg", "concept-3.jpeg", "concept-4.jpeg",
            "concept-5.jpeg", "concept-6.jpeg", "concept-7.jpeg", "concept-8.jpeg", "concept-9.jpeg"
          ]),
        },
      ],
    },
  ],

  // Loose gallery shown under the home-page cards (pages from images/sketchbook.pdf)
  sketchbook: img("sketchbook", [
    "01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg",
    "08.jpg", "09.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg",
  ]),
};
