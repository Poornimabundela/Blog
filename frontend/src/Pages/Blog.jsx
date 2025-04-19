import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BaseUrl, get, post } from '../services/Endpoint';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function Blog() {
  const { postId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const [singlePost, setSinglePost] = useState(null);
  const [comment, setComment] = useState('');
  const [loaddata, setLoaddata] = useState(false);

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        const request = await get(`/public/Singlepost/${postId}`);
        const response = request.data;
        setSinglePost(response.Post);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePost();
  }, [loaddata, postId]);

  const onSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login');
    } else {
      try {
        const request = await post("/comment/addcomment", {
          comment,
          postId,
          userId: user._id,
        });
        const response = request.data;
        setLoaddata((prevState) => !prevState);
        if (response.success) {
          toast.success(response.message);
          setComment('');
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {singlePost && (
            <>
              <h1 className="fw-bold mb-4 display-5 text-center">{singlePost.title}</h1>

              <img
                src={`${BaseUrl}/images/${singlePost.image}`}
                alt="Post Banner"
                className="img-fluid mb-4 rounded-4 shadow"
                style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
              />

              <p className="lead lh-lg fs-5">{singlePost.desc}</p>

              <hr className="my-5" />

              <h3 className="mb-3">Leave a Comment</h3>
              <form onSubmit={onSubmitComment}>
                <div className="mb-3">
                  <textarea
                    className="form-control p-3"
                    rows="4"
                    placeholder="Write your comment here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    style={{ borderRadius: '10px', fontSize: '1rem' }}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-dark px-4 py-2 rounded-3 shadow-sm">
                  Submit Comment
                </button>
              </form>

              <hr className="my-5" />

              <h3 className="mb-4">Comments</h3>
              {singlePost.comments && singlePost.comments.length > 0 ? (
                singlePost.comments.slice().reverse().map((elem) => (
                  <div className="card bg-light border-0 shadow-sm mb-3" key={elem._id}>
                    <div className="card-body d-flex align-items-start">
                      <img
                        src={`${BaseUrl}/images/${elem.userId.profile}`}
                        alt={elem.userId.FullName}
                        className="rounded-circle me-3"
                        style={{ width: "55px", height: "55px", objectFit: "cover" }}
                      />
                      <div>
                        <h6 className="mb-1 fw-semibold">{elem.userId.FullName}</h6>
                        <p className="mb-0 text-muted">{elem.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No comments yet. Be the first to comment!</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
