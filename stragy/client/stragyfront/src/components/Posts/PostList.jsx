import React from 'react';
import PostCard from '../../Pages/Posts/PostCard';

const PostList = ({ posts = [] }) => (
  <section className='post-list'>
    {Array.isArray(posts) && posts.length ? (
      posts.map((post, index) => (
        <PostCard key={post.id ?? `${post.postTitle ?? 'untitled'}-${index}`} post={post} />
      ))
    ) : (
      <p>No posts yet.</p>
    )}
  </section>
);

export default PostList;
