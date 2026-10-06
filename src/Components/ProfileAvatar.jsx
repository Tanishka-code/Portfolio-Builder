const ProfileAvatar = ({ src, alt = "Profile image", className = "" }) => (
  <div
    className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-gradient-to-br from-purple-100 to-green-100 shadow-lg ${className}`}
  >
    {src ? (
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    ) : (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label="Default profile placeholder"
        role="img"
        className="h-1/2 w-1/2 text-purple-400"
      >
        <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z" />
      </svg>
    )}
  </div>
);

export default ProfileAvatar;
