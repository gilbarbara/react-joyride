export default function NPMIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      height={size}
      preserveAspectRatio="xMidYMid"
      version="1.1"
      viewBox="0 0 256 256"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <polygon fill="#C12127" points="0 256 0 0 256 0 256 256" />
        <polygon
          fill="#FFFFFF"
          points="48 48 208 48 208 208 176 208 176 80 128 80 128 208 48 208"
        />
      </g>
    </svg>
  );
}
