import { Star, User, Edit, Trash2, Cone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { create_comment, delete_comment, update_comment } from '../../../api/Review&comments/Handel_comments';
import { one_product } from '../../../store/Product/Product_api';
export default function Reviews(props) {
  const { user, loading } = useSelector((state) => state.auth_slice || {});
  let dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editId, seteditId] = useState(null);

  let [message_create, setmessage_create] = useState(null);
  let [message_delete, setmessage_delete] = useState(null);
  let [message_update, setmessage_update] = useState(null);
  let reviews = props.reviews || [];
  let review_count = props.review_count || 0;
  let avg_review = props.avg_review || 0;
  let product = props.product || 0;

  const handleSubmit = async () => {
    const data = {
      rating,
      title: comment,
      product
    };
    try {
      if (comment.length < 4) {
        return true;
      }
      let fetch = await create_comment(data);
      await dispatch(one_product(product));
      setmessage_create(fetch.message || fetch.product);
    } catch (err) {
      setmessage_create(err || err.message);
    }
    setComment('');
  };

  // delete comment
  const handleDelete = async (reviewId) => {
    try {
      let res = await delete_comment(reviewId);
      await dispatch(one_product(product));
      setmessage_delete(res.message || res.id);
      setDeletingId(null);
    } catch (err) {
      setmessage_delete(err?.message || err);
    }
  };
  //update comment
  let handeleditproduct = async ({ review_id, title, rating }) => {
    seteditId({ review_id, title, rating });
    setComment(title);
    setRating(rating);
  };
  //save comment after edit
  let handelsaveedit = async () => {
    try {
      let data = { title: comment, rating: rating };
      let res = await update_comment({ id: editId.review_id, data });
      seteditId(null);
      await dispatch(one_product(product));
      setmessage_update(res.message || 'updated done');
      setComment('');
    } catch (err) {
      setmessage_update(err?.message || err || 'Error ');
    }
  };
  return (
    <section className="mt-16">
      <h2 className="mb-8 text-3xl font-bold">Customer Reviews</h2>

      {/* Review Summary */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border p-6 text-center">
          <h3 className="text-5xl font-bold">{avg_review.toFixed(1)}</h3>

          <div className="mt-3 flex justify-center text-yellow-400">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star key={item} size={22} fill="currentColor" />
            ))}
          </div>

          <p className="mt-2 text-gray-500">Based on 120 Reviews</p>
        </div>

        <div className="space-y-4 rounded-2xl border p-6 md:col-span-2">
          {[5, 4, 3, 2, 1].map((num) => (
            <div key={num} className="flex items-center gap-3">
              <span>{num}</span>

              <Star size={18} className="text-yellow-400" fill="currentColor" />

              <div className="h-3 flex-1 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-yellow-400"
                  style={{
                    width: `${num * 18}%`
                  }}
                />
              </div>

              <span>20</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review */}
      <div className="mb-10 rounded-2xl border p-6">
        <h3 className="mb-5 text-xl font-bold">Write A Review</h3>

        <div className="mb-5 flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button key={num} onClick={() => setRating(num)}>
              <Star size={30} className={num <= rating ? 'text-yellow-400' : 'text-gray-300'} fill={num <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="h-32 mb-3 w-full resize-none rounded-xl border p-4 outline-none focus:ring-2 focus:ring-black"
        />
        {!user && (
          <Link to={'/Login'} className="mt-4  cursor-not-allowed rounded-xl bg-black px-8 py-3 text-white transition hover:bg-gray-800">
            Submit Review
          </Link>
        )}
        {user && !editId && (
          <button onClick={handleSubmit} className="mt-4  rounded-xl bg-black px-8 py-3 text-white transition hover:bg-gray-800">
            Submit Review
          </button>
        )}
        {user && editId && (
          <button onClick={handelsaveedit} className="mt-4  rounded-xl bg-black px-8 py-3 text-white transition hover:bg-gray-800">
            update Review
          </button>
        )}
        {message_create ? <p className="mt-3 pl-1 capitalize text-violet-900">{message_create}</p> : ''}
        {message_update ? <p className="mt-3 pl-1 capitalize text-green-900">{message_update}</p> : ''}
      </div>
      {message_delete ? <p className="mt-3 pl-1 capitalize text-green-900">{message_delete}</p> : ''}

      {/* Comments */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          /* Empty State */
          <div className="backdrop-blur-xs flex flex-col items-center justify-center rounded-3xl border border-gray-200/80 bg-slate-50/50 px-6 py-12 text-center">
            <h3 className="text-base font-semibold text-gray-900">No reviews yet</h3>
            <p className="mt-1 text-xs text-gray-500">Be the first to share your thoughts!</p>
          </div>
        ) : (
          /* Reviews List */
          reviews.map((review) => (
            <div
              key={review._id}
              className="shadow-xs group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              {/* Header Section: User Info & Actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-base font-bold text-white shadow-md shadow-slate-900/10">
                    {review.user?.name?.[0] || 'U'}
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900 sm:text-base">{review.user?.name || 'User'}</h4>
                      {/* Created Date */}
                      <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Stars */}
                    <div className="mt-1 flex items-center gap-1">
                      <div className="flex gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-200'} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-gray-700">({review.rating}.0)</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons & Delete Confirmation */}
                {user?.id === review.user?.id && (
                  <div className="relative">
                    {deletingId === review._id ? (
                      /* Confirm Delete UI */
                      <div className="flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50/90 px-3 py-1 text-xs">
                        <span className="font-semibold text-rose-700">Delete?</span>
                        <button type="button" onClick={() => handleDelete(review._id)} className="rounded-full bg-rose-600 px-2.5 py-0.5 font-bold text-white transition hover:bg-rose-700">
                          Yes
                        </button>
                        <button type="button" onClick={() => setDeletingId(null)} className="rounded-full bg-gray-200 px-2 py-0.5 font-medium text-gray-700 transition hover:bg-gray-300">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      /* Default Action Icons */
                      <div className="backdrop-blur-xs flex items-center gap-1 rounded-full border border-gray-100 bg-slate-50/80 p-1">
                        <button
                          onClick={() => {
                            handeleditproduct({ review_id: review._id, title: review.title, rating: review.rating });
                          }}
                          type="button"
                          className="hover:shadow-xs rounded-full p-2 text-gray-400 transition-colors hover:bg-white hover:text-indigo-600"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(review._id)}
                          className="hover:shadow-xs rounded-full p-2 text-gray-400 transition-colors hover:bg-white hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Comment Body */}
              <div className="mt-4 rounded-2xl bg-slate-50/60 p-4 transition-colors group-hover:bg-slate-50">
                {review.title && <h5 className="mb-1 text-sm font-bold text-gray-900">{review.title}</h5>}
                <p className="text-sm leading-relaxed text-gray-600">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
