import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="mb-3 font-serif text-5xl">404</h1>
      <p className="mb-4 text-muted-foreground">This page isn’t in your order book.</p>
      <Link to="/dashboard" className="text-primary hover:underline">
        Back to overview
      </Link>
    </div>
  </div>
);

export default NotFound;
