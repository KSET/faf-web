import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: "2024-05-03",
  perspective: "published",
});

export const urlFor = (source: any) => {
  if (!source) return "";
  return imageUrlBuilder(client).image(source).url();
};

export async function getFrontpagePosts() {
  const posts = await client.fetch(
    '*[_type == "post" && publishedAt < now()] | order(publishedAt desc) { _id, title, slug, mainImage, publishedAt } [0...3]'
  );
  return posts;
}

export async function getAllPosts() {
  const posts = await client.fetch(
    '*[_type == "post" && publishedAt < now()] | order(publishedAt desc) { _id, title, slug, mainImage, publishedAt }'
  );
  return posts;
}

export async function getPost(slug: string) {
  const post = await client.fetch(
    '*[_type == "post" && slug.current == $slug] { _id, title, body, mainImage, publishedAt }',
    { slug }
  );
  return post[0];
}

export const formatDate = (dateStr: string) => {
  const croatianMonths = [
    "siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja",
    "srpnja", "kolovoza", "rujna", "listopada", "studenoga", "prosinca"
  ];
  
  const dateObj = new Date(dateStr);
  
  const day = dateObj.getUTCDate();
  const month = croatianMonths[dateObj.getUTCMonth()];
  const year = dateObj.getUTCFullYear();
  
  const croatianDate = `${day}. ${month} ${year}`;

  return croatianDate;
}
