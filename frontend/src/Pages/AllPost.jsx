import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { BaseUrl, delet, get } from '../services/Endpoint';
import toast from 'react-hot-toast';

export default function AllPost() {
  const [posts, setPosts] = useState([]);
  const [loadData, setLoadData] = useState(false);

  const handleDelete = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');

    if (confirmed) {
      try {
        const response = await delet(`/blog/delete/${postId}`);
        const data = response.data;

        if (data.success) {
          toast.success(data.message);
          setLoadData(!loadData); // Trigger reload
        } else {
          toast.error('Failed to delete the post.');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error(error?.response?.data?.message || "An unexpected error occurred.");
      }
    }
  };

  const handleUpdate = (postId) => {
    console.log(`Post with ID ${postId} update requested.`);
    // Add navigation logic here if needed
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await get("/blog/GetPosts");
        const data = response.data;
        setPosts(data.posts);
        console.log(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load posts.");
      }
    };
    getPosts();
  }, [loadData]);

  return (
    <div className="container">
      <h1 className="text-center mb-4 text-white">All Posts</h1>
      <div className="row">
        {posts && posts.map((post) => (
          <div className="col-md-4 mb-4" key={post._id}>
            <div className="card h-100">
              <img
                src={`${BaseUrl}/uploads/${post.postimg}`}
                className="card-img-top"
                alt={post.title}
                style={{ objectFit: 'cover', height: '250px' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x250?text=No+Image' }}
              />
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-danger" onClick={() => handleDelete(post._id)}>
                  <FaTrashAlt /> Delete
                </button>
                <button className="btn btn-warning" onClick={() => handleUpdate(post._id)}>
                  <FaEdit /> Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
