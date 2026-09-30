import React, { useEffect, useState } from 'react';
import { PlaceDetail, Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  MapPin, 
  Navigation, 
  Clock, 
  Calendar, 
  DollarSign, 
  Star, 
  PlusCircle, 
  MessageSquare, 
  Send, 
  Info, 
  Lightbulb, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface PlaceDetailModalProps {
  placeId: number | null;
  onClose: () => void;
  onOpenAddToTrip: (placeId: number) => void;
  onOpenAuth: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  placeId,
  onClose,
  onOpenAddToTrip,
  onOpenAuth
}) => {
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Review submission state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!placeId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    api.getPlaceById(placeId)
      .then((data) => {
        if (isMounted) {
          setPlace(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load place details');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  if (!placeId) return null;

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    if (!reviewComment.trim() || !place) return;

    setSubmittingReview(true);
    try {
      await api.addReview(place.id, {
        rating: reviewRating,
        comment: reviewComment.trim()
      });

      // Reload place details to display the fresh review
      const refreshed = await api.getPlaceById(place.id);
      setPlace(refreshed);
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700 transition-all shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-sky-500 border-t-transparent animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Loading rich transit and destination details...</p>
          </div>
        ) : error || !place ? (
          <div className="p-12 text-center">
            <p className="text-rose-400 font-bold mb-2">Error loading place details</p>
            <p className="text-slate-400 text-xs mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 rounded-xl text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            
            {/* Hero Image Header with Gradient Overlay */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/30" />
              
              {/* Badges on image */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-sky-400 text-xs font-extrabold border border-sky-500/30 flex items-center gap-1.5 shadow-md">
                  <span>{place.flagEmoji}</span>
                  <span>{place.countryName}</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30 shadow-md">
                  {place.categoryName}
                </span>
              </div>

              {/* Title & Floating Action Banner */}
              <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{place.city}, {place.countryName}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    {place.name}
                  </h1>
                </div>

                {/* Add to Trips CTA Button */}
                <button
                  onClick={() => onOpenAddToTrip(place.id)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Add to My Trips</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 sm:p-6 bg-slate-950/60 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <div>
                  <span className="block font-bold text-white text-sm">{place.rating} / 5.0</span>
                  <span className="text-[10px] text-slate-400">{place.reviewCount} traveler reviews</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="block font-bold text-white text-sm">
                    {place.ticketPriceUSD === 0 ? 'Free Entry' : `$${place.ticketPriceUSD.toFixed(2)}`}
                  </span>
                  <span className="text-[10px] text-slate-400">Admission price</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="block font-bold text-white text-sm">{place.recommendedDuration}</span>
                  <span className="text-[10px] text-slate-400">Suggested duration</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <Calendar className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="block font-bold text-white text-sm">Best Season</span>
                  <span className="text-[10px] text-slate-400 truncate block max-w-[130px]" title={place.bestTimeToVisit}>
                    {place.bestTimeToVisit}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-8 space-y-8">
              
              {/* Detailed Description */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-sky-400" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs">
                    About This Destination
                  </h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed sm:text-base">
                  {place.description || place.summary}
                </p>
              </section>

              {/* HOW TO GO THERE - TRANSIT GUIDE (Crucial User Requirement) */}
              <section className="bg-gradient-to-br from-sky-950/40 via-indigo-950/20 to-slate-900 p-5 sm:p-6 rounded-2xl border border-sky-500/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-2.5 mb-3 text-sky-400">
                  <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/40">
                    <Navigation className="w-5 h-5 text-sky-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
                      How to Go There & Transit Guide
                    </h3>
                    <p className="text-[11px] text-sky-300/80">
                      Step-by-step directions, metro lines, train stations & transfers
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                  {place.howToGoThere}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span><strong>Hours:</strong> {place.openingHours}</span>
                  </div>
                  {place.latitude !== 0 && (
                    <div className="flex items-center gap-1.5 text-sky-300/80 font-mono text-[11px]">
                      <span>Geo: {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Key Highlights */}
              {place.highlights && place.highlights.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Key Highlights & Must-See Features
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {place.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/70 text-xs text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Travel Tips */}
              {place.travelTips && (
                <section className="bg-amber-950/20 border border-amber-500/20 p-4 sm:p-5 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-amber-200">
                  <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px] mb-1">
                      Insider Travel Tips
                    </h4>
                    <p className="text-amber-100/90 leading-relaxed">{place.travelTips}</p>
                  </div>
                </section>
              )}

              {/* Gallery Previews */}
              {place.galleryImages && place.galleryImages.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                    Photo Gallery
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {place.galleryImages.map((imgUrl, i) => (
                      <img
                        key={i}
                        src={imgUrl}
                        alt={`${place.name} photo ${i + 1}`}
                        className="w-full h-36 object-cover rounded-xl border border-slate-800 hover:scale-105 transition-transform"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews & Ratings Section */}
              <section className="border-t border-slate-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Community Reviews ({place.reviews?.length || 0})
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{place.rating.toFixed(1)} / 5.0</span>
                  </div>
                </div>

                {/* Review Form */}
                <form onSubmit={handleAddReview} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-slate-300">Leave Your Review:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= reviewRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      rows={2}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={isAuthenticated ? "Share your travel tip or experience..." : "Sign in to leave a review"}
                      disabled={!isAuthenticated}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none disabled:opacity-50"
                    />
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    {reviewSuccess && (
                      <span className="text-xs text-emerald-400 font-medium">Review posted successfully!</span>
                    )}
                    <button
                      type="submit"
                      disabled={submittingReview || !isAuthenticated || !reviewComment.trim()}
                      className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingReview ? 'Posting...' : 'Post Review'}</span>
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {place.reviews && place.reviews.length > 0 ? (
                    place.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-3"
                      >
                        <img
                          src={rev.userAvatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={rev.username}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-200">{rev.username}</span>
                            <div className="flex items-center gap-0.5">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">
                      No reviews yet. Be the first explorer to review this destination!
                    </p>
                  )}
                </div>
              </section>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
