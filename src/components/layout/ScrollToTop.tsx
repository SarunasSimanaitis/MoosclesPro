import { useEffect } from "react";
import {
  useLocation,
  useNavigationType,
} from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } =
    useLocation();

  const navigationType =
    useNavigationType();

  useEffect(() => {
    /*
     * For normal link navigation, start the
     * destination page at the top.
     *
     * For browser back/forward navigation,
     * allow the browser to restore its previous
     * scroll position naturally.
     */
    if (navigationType === "POP") {
      return;
    }

    if (hash) {
      const element =
        document.getElementById(
          hash.slice(1),
        );

      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView();
        });

        return;
      }
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [
    pathname,
    search,
    hash,
    navigationType,
  ]);

  return null;
}