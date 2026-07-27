'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { MessageSquare, Calendar, User, Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, token, user } = useAuth();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Detail selection state
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [blogOpen, setBlogOpen] = useState(false);

  // Comment state
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(res.data.data.blogs || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const blogId = searchParams.get('id');
    if (blogId) {
      axios.get(`http://localhost:5000/api/blogs/${blogId}`).then((res) => {
        setSelectedBlog(res.data.data.blog);
        setBlogOpen(true);
      });
    }
  }, [searchParams]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token || !commentContent) return;
    setCommentLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/blogs/comment',
        {
          blogId: selectedBlog.id,
          content: commentContent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.status === 'success') {
        setCommentContent('');
        // Reload detail details to capture new comments
        const details = await axios.get(`http://localhost:5000/api/blogs/${selectedBlog.id}`);
        setSelectedBlog(details.data.data.blog);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-cream py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          
          {!blogOpen ? (
            /* Blog List */
            <div className="space-y-16 animate-fade-in">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
                  Eco Travel Chronicles
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-forest font-semibold">
                  Travel Stories & Sustainable Wisdom
                </h1>
                <p className="text-xs text-charcoal/60 mt-3 font-light leading-relaxed">
                  Read seasonal essays on B-Corp architectural updates, wildlife tracking methodologies, and carbon mitigation calculators.
                </p>
              </div>

              {loading ? (
                <div className="space-y-8">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl h-[280px] animate-pulse border border-forest/5" />
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {blogs.map((blog) => (
                    <div
                      key={blog.id}
                      onClick={() => {
                        setSelectedBlog(blog);
                        setBlogOpen(true);
                        router.push(`/blog?id=${blog.id}`, { scroll: false });
                      }}
                      className="bg-white border border-forest/5 rounded-3xl overflow-hidden shadow-soft hover:border-gold/30 hover:scale-[1.005] transition-all duration-300 flex flex-col md:flex-row cursor-pointer"
                    >
                      <div className="relative w-full md:w-[320px] h-64 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="p-8 flex flex-col justify-between flex-grow">
                        <div className="space-y-3">
                          <span className="bg-gold/10 text-gold text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full">
                            {blog.category}
                          </span>
                          
                          <h3 className="font-serif text-xl text-forest font-bold leading-snug line-clamp-2">
                            {blog.title}
                          </h3>
                          
                          <p className="text-xs text-charcoal/60 line-clamp-2 leading-relaxed font-sans font-light">
                            {blog.content}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-forest/5 flex items-center justify-between text-[10px] uppercase tracking-widest text-forest/50 font-inter font-semibold mt-6">
                          <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-gold" /> {blog.author?.name}</span>
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-gold" /> {blog.readTime} Min Read</span>
                          <span className="flex items-center text-gold">Read Article <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Blog Article View */
            <div className="space-y-8 animate-fade-in">
              <button
                onClick={() => {
                  setBlogOpen(false);
                  setSelectedBlog(null);
                  router.push('/blog', { scroll: false });
                }}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-forest font-bold hover:text-gold transition-colors font-inter"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Blog</span>
              </button>

              <article className="bg-white rounded-3xl border border-forest/5 p-8 md:p-12 shadow-luxury space-y-6">
                
                {/* Meta details */}
                <div className="space-y-4">
                  <span className="bg-gold text-charcoal text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full">
                    {selectedBlog.category}
                  </span>
                  <h1 className="font-serif text-3xl md:text-4xl text-forest font-bold leading-tight">
                    {selectedBlog.title}
                  </h1>
                  
                  <div className="flex items-center space-x-6 text-[10px] uppercase tracking-widest text-forest/50 font-semibold font-inter">
                    <span className="flex items-center"><User className="w-4 h-4 mr-1 text-gold" /> {selectedBlog.author?.name}</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-gold" /> {new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gold" /> {selectedBlog.readTime} Min Read</span>
                  </div>
                </div>

                {/* Banner image */}
                <div className="h-96 w-full rounded-2xl overflow-hidden shadow-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                </div>

                {/* Content body */}
                <p className="text-sm text-charcoal/80 leading-relaxed font-sans font-light pt-4 white-space-pre-line">
                  {selectedBlog.content}
                </p>

              </article>

              {/* Comments Section */}
              <div className="bg-white rounded-3xl border border-forest/5 p-8 md:p-12 shadow-soft space-y-8">
                <h3 className="font-serif text-lg text-forest font-semibold flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-gold" />
                  <span>Discussion ({selectedBlog.comments?.length || 0})</span>
                </h3>

                {/* Comment Logger Form */}
                {isAuthenticated ? (
                  <form onSubmit={handlePostComment} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-inter tracking-widest text-forest font-semibold block">Post Comment</label>
                      <textarea
                        rows={3}
                        placeholder="Add to the sustainable discussion..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="w-full bg-forest/5 border border-forest/10 rounded-xl p-4 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className="bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-[10px] tracking-widest uppercase px-6 py-3 rounded-full transition-colors cursor-pointer"
                    >
                      {commentLoading ? 'Posting...' : 'Submit Comment'}
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-forest/60 italic font-sans font-light">
                    Please log in to participate in discussion threads.
                  </p>
                )}

                {/* List Comments */}
                <div className="space-y-4 pt-4 border-t border-forest/5">
                  {selectedBlog.comments && selectedBlog.comments.length > 0 ? (
                    selectedBlog.comments.map((comment: any) => (
                      <div key={comment.id} className="flex items-start space-x-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={comment.user?.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gold mt-1" />
                        <div className="bg-cream/50 border border-forest/5 rounded-2xl p-4 flex-grow space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-inter uppercase font-semibold text-forest">
                            <span>{comment.user?.name}</span>
                            <span className="text-[9px] text-charcoal/40">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-charcoal/80 font-sans font-light">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-forest/50 italic text-center py-4">No comments posted yet.</p>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function Blog() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-gold border-t-forest rounded-full animate-spin" />
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}
