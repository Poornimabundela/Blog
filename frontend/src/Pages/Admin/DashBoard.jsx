// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { get } from '../../services/Endpoint';

export default function Dashboard() {
  const [post, setPost] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const GetData = async () => {
      try {
        const request = await get('/dashboard');
        const response = request.data;

        if (request.status === 200) {
          setPost(response.Posts);
          setUsers(response.Users);
          setComments(response.comments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    GetData();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-white">Dashboard</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card bg-primary text-white mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Posts</h5>
              <p className="card-text">{post.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Comments</h5>
              <p className="card-text">{comments.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
