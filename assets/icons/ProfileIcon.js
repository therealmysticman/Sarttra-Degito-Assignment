const ProfileIcon = ({ className = "w-6 h-6", color = "white" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none" className={className}>
      <path d="M15 17V15C15.0618 14.0065 14.7287 13.0288 14.0732 12.2796C13.4177 11.5305 12.4929 11.0706 11.5 11H4.49997C3.50705 11.0706 2.5822 11.5305 1.9267 12.2796C1.27121 13.0288 0.938136 14.0065 0.999973 15V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.99997 9C9.96389 9 11.556 7.20914 11.556 5C11.556 2.79086 9.96389 1 7.99997 1C6.03605 1 4.44397 2.79086 4.44397 5C4.44397 7.20914 6.03605 9 7.99997 9Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};
export default ProfileIcon;