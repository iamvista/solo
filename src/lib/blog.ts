import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Blog post type definition
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  heroImage?: string;
  tags: string[];
  content: string;
}

// Blog directory path
const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

// Get all blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  // Check if directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      pubDate: data.pubDate || new Date().toISOString(),
      updatedDate: data.updatedDate,
      heroImage: data.heroImage,
      tags: data.tags || [],
      content,
    };
  });

  // Sort by pubDate descending
  return posts.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);

  let filePath = "";
  if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || "Untitled",
    description: data.description || "",
    pubDate: data.pubDate || new Date().toISOString(),
    updatedDate: data.updatedDate,
    heroImage: data.heroImage,
    tags: data.tags || [],
    content,
  };
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllPosts();
  const tagSet = new Set<string>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
