import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="font-display text-9xl font-bold text-primary">404</h1>
          <h2 className="font-display text-3xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="font-body text-lg text-gray-600 max-w-md">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/search">
              <ApperIcon name="Search" className="w-4 h-4 mr-2" />
              Search Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;