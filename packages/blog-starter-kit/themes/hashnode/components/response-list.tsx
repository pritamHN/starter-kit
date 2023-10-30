import { useState, useEffect } from 'react';

import { Post } from '../types';
import { getHashId } from '../utils/commonUtils';
import ResponseCard from './response-card';
import { useAppContext } from './contexts/appContext';
import { NoCommentsLightSVG, NoCommentsDarkSVG } from './icons/svgs';

interface Props {
  isPublicationPost: boolean;
  currentFilter: string;
}

function ResponseList(props: Props) {
  const { isPublicationPost, currentFilter } = props;
  const isDarkTheme = false; // TODO: To be fixed
  const { post: _post } = useAppContext();
  const post = _post as any;
  const [isLoading, setLoading] = useState(false);
  const [responsesLoaded, setResponsesLoaded] = useState(false);
  const [initialResponsesLoaded, setInitialResponsesLoaded] = useState(false);
  const [isFetchingReactionStatus, setIsFetchingReactionStatus] = useState(true);
  const hashId = getHashId();

  const responses: any = [];
  post.responses.forEach((response: any, index: any) => {
    if (
      !response.isCollapsed
    ) {
      responses.push(
        <ResponseCard
          key={response._id.toString()}
          isPublicationPost={isPublicationPost}
          response={response}
          context="spp"
          isLast={index === post.responses.length - 1}
          isValidating={isFetchingReactionStatus}
        />,
      );
    }
  });

  useEffect(() => {
    (async () => {
      if (post.responseCount === 0) {
        return;
      }
      setLoading(true);
      setResponsesLoaded(false);
      setResponsesLoaded(true);
      setLoading(false);
      if (!initialResponsesLoaded) {
        setInitialResponsesLoaded(true);
      }
      // Scroll to responseId after the responses load
      if (!hashId) {
        return;
      }
      const el = document.getElementById(hashId);
      if (!el) {
        return;
      }
      el.scrollIntoView();
    })();
  }, [currentFilter]);

  useEffect(() => {
    (async () => {
      if (!responsesLoaded || !post) {
        setIsFetchingReactionStatus(false);
        return;
      }
      setIsFetchingReactionStatus(true);
      setIsFetchingReactionStatus(false);
    })();
  }, [responsesLoaded]);

  if (post.responseCount === 0) {
    return (
      <div className="flex h-3/5 flex-col items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        {isDarkTheme ? <NoCommentsDarkSVG className="h-40 w-40" /> : <NoCommentsLightSVG className="h-40 w-40" />}
        <p>No comments yet</p>
      </div>
    );
  }

  return (
    <div className="mx-2 pb-10 lg:mx-0" id="comments-list">
      {post.responseCount > 0 && !isLoading && responses}
      {isLoading &&
        [...Array(3).keys()].map((val: number) => (
          <div key={`comments-list-loader-${val}`} className="animate-pulse border-b-1/2 dark:border-slate-700">
            <div className="px-4 py-5">
              <div className="mb-6 flex flex-row items-center bg-white  dark:border-slate-800 dark:bg-slate-900">
                <div className="mr-4 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-56 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
              <div>
                <div className="mb-2 h-3 w-11/12 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mb-2 h-3 w-11/12 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mb-2 h-3 w-11/12 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ResponseList;
