import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import {getImageDimensions} from '@sanity/asset-utils'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: "2024-05-03",
  perspective: "published",
});

const builder = imageUrlBuilder(client)

export const urlFor = (source: any, width?: number, height?: number) => {
  if (!source) return "";

  const image = builder.image(source);
  
  if (width) {
    image.width(width);
  }
  
  if (height) {
    image.height(height);
  }

  return image.url();
};

export const dimensionsFor = (source: any) => {
  return getImageDimensions(source);
  
}


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

export async function getAllGalleries() {
  const galleries = await client.fetch(
    '*[_type == "gallery"] | order(publishedAt desc) { _id, title, slug, publishedAt, coverImage }'
  );
  return galleries;
}

export async function getGallery(slug: string) {
  const gallery = await client.fetch(
    '*[_type == "gallery" && slug.current == $slug] { _id, title, body, publishedAt, coverImage, images }',
    {slug}
  );
  return gallery[0];
}


export async function getAllTimeslots() {
  const timeslots = await client.fetch(
    '*[_type == "timeslot"] | order(publishedAt desc) { _id, title, slug, isClickable, startTime, endTime }'
  );
  return timeslots;
}

export async function getTimeslot(slug: string) {
  const timeslot = await client.fetch(
    '*[_type == "timeslot" && slug.current == $slug] { _id, title, body, isClickable, startTime, endTime, movies }',
    { slug }
  );
  return timeslot[0];
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
