import { Link, useLocation } from "react-router-dom";

export default function AppBar() {
  const location = useLocation();
  const selectedKey = location.pathname === "/" ? "/" : location.pathname;

  const linkBase = "inline-flex items-center h-full px-3 rounded-md text-sm font-medium transition-colors hover:bg-transparent focus:bg-transparent active:bg-transparent focus:outline-none focus-visible:outline-none ring-0 focus:ring-0";
  const linkInactive = "text-gray-700 hover:text-blue-600";
  const linkActive = "text-blue-600";

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full bg-gray-100 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-inherit">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white font-semibold">
              IF
            </span>
            <span className="font-semibold text-base">InsightFlow</span>
          </Link>

          <nav className="flex-1 min-w-0">
            <ul className="flex h-14 items-stretch gap-1">
              <li>
                <Link
                  to="/"
                  className={`${linkBase} ${selectedKey === "/" ? linkActive : linkInactive}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`${linkBase} ${selectedKey === "/about" ? linkActive : linkInactive}`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/organizations"
                  className={`${linkBase} ${selectedKey === "/organizations" ? linkActive : linkInactive}`}
                >
                  Organizations
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}


