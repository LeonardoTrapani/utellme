import React from "react";
import { AiFillStar } from "react-icons/ai";

export const StaticRatingComponent: React.FC<{
  rating: number;
}> = (props) => {
  return (
    <ul className="flex">
      <SingleRatingComponent
        rating={props.rating}
        i={1}
      />
      <SingleRatingComponent
        rating={props.rating}
        i={2}
      />
      <SingleRatingComponent
        rating={props.rating}
        i={3}
      />
      <SingleRatingComponent
        rating={props.rating}
        i={4}
      />
      <SingleRatingComponent
        rating={props.rating}
        i={5}
      />
    </ul>
  )
}

export const SelectRatingComponent: React.FC<{
  rating: number | undefined;
  onRatingChange: (rating: number) => void;
}> = (props) => {
  return (
    <div className="mb-4 flex gap-0 items-center">
      <SingleRatingComponent i={1} isBig rating={props.rating} onRatingChange={(i: number) => {
        props.onRatingChange(i);
      }} />
      <SingleRatingComponent i={2} isBig rating={props.rating} onRatingChange={(i: number) => {
        props.onRatingChange(i);
      }} />
      <SingleRatingComponent i={3} isBig rating={props.rating} onRatingChange={(i: number) => {
        props.onRatingChange(i);
      }} />
      <SingleRatingComponent i={4} isBig rating={props.rating} onRatingChange={(i: number) => {
        props.onRatingChange(i);
      }} />
      <SingleRatingComponent i={5} isBig rating={props.rating} onRatingChange={(i: number) => {
        props.onRatingChange(i);
      }} />
    </div>)
}

const SingleRatingComponent: React.FC<{
  rating: number | undefined;
  i: number;
  onRatingChange?: (rating: number) => void;
  isBig?: boolean;
}> = (props) => {
  const active = (props.rating || 0) >= props.i;
  return (
    <a
      className={`
        ${`${active ? 'text-primary' : 'text-gray-400 dark:text-current '} select-none`} 
        cursor-pointer ${props.isBig ? 'text-4xl' : ''} self-center
        `
      }
      onClick={() => {
        if (props.onRatingChange) props.onRatingChange(props.i);
      }}
    >
      <AiFillStar />
    </a >
  )
}
