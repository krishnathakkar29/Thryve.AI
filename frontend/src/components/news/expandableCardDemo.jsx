"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { hello } from "@/constants/newsdata";

export function ExpandableCardDemo() {
  const [active, setActive] = useState(null);
  const [articles, setArticles] = useState(hello.articles.slice(0,10).filter((item) => item.source.id != null))
  const observerTarget = useRef(null);
  const id = useId();
  const ref = useRef(null);

  

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const handleImageError = (e) => {
    e.target.src = '/placeholder-image.jpg'; // Replace with your placeholder image
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.05 },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`} className="w-full h-48 overflow-hidden">
                <img
                  src={active.urlToImage}
                  alt={active.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="p-4">
                <motion.h3
                  layoutId={`title-${active.title}-${id}`}
                  className="font-medium text-neutral-700 dark:text-neutral-200 text-xl mb-2"
                >
                  {active.title}
                </motion.h3>
                <motion.p
                  layoutId={`author-${active.author}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-sm mb-4"
                >
                  By {active.author || 'Unknown Author'}
                </motion.p>
                <motion.p className="text-neutral-600 dark:text-neutral-400 text-base mb-4">
                  {active.description}
                </motion.p>
                <motion.a
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Read More
                </motion.a>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hello.articles.slice(0,9).filter((item) => item.url != null).map((article, index) => (
            <motion.div
              layoutId={`card-${article.title}-${id}`}
              key={`${article.title}-${index}`}
              onClick={() => setActive(article)}
              className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer border border-neutral-200 dark:border-neutral-700"
            >
              <motion.div layoutId={`image-${article.title}-${id}`} className="w-full h-40 mb-4 overflow-hidden rounded-lg">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="flex flex-col gap-2">
                <motion.h3
                  layoutId={`title-${article.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-lg line-clamp-2"
                >
                  {article.title}
                </motion.h3>
                <motion.p
                  layoutId={`author-${article.author}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-sm"
                >
                  By {article.author || 'Unknown Author'}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>

       
      </div>
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.05 },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};