import PostCard from './PostCard.jsx'
const PostList = ({ posts = [], isLoading = false, showActions = false }) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="
              relative
              h-[360px]
              overflow-hidden
              rounded-[28px]
              border
              border-border
              bg-surface
              shadow-sm
            "
          >
            <div className="h-40 animate-pulse bg-background" />
            <div className="space-y-4 p-6">
              <div className="h-3 w-20 animate-pulse rounded-full bg-border" />
              <div className="h-6 w-4/5 animate-pulse rounded-lg bg-border" />
              <div className="h-4 w-full animate-pulse rounded-lg bg-border" />
              <div className="h-4 w-3/4 animate-pulse rounded-lg bg-border" />
              <div className="pt-6">
                <div className="h-3 w-1/2 animate-pulse rounded-full bg-border" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className="
          pointer-events-none
          absolute
          -top-20
          left-1/2
          h-40
          w-40
          -translate-x-1/2
          rounded-full
          bg-primary/5
          blur-3xl
        "
      />

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          lg:gap-7
        "
      >
        {posts.map((post, index) => {
          const author = post?.author?.authorId;
          const firstName = author?.identity?.firstName || "";
          const lastName = author?.identity?.lastName || "";
          const username = author?.identity?.username || "";
          const authorName =
            [firstName, lastName].filter(Boolean).join(" ") ||
            username ||
            "Unknown author";
          const authorAvatar = author?.profile?.avatar || null;
          const normalizedPost = {
            ...post,
            authorName,
            authorAvatar,
            author: {
              ...post.author,
              name: authorName,
              username,
              avatar: authorAvatar,
            },
          };

          return (
            <div
              key={post?._id || post?.id || index}
              className="
                min-w-0
                transition-transform
                duration-300
                hover:-translate-y-1
              "
            >
              <PostCard post={normalizedPost} showActions={showActions} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostList;
