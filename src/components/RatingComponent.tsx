import React from "react";
import { AiFillStar } from "react-icons/ai";

export const StaticRatingComponent: React.FC<{
  rating: number;
  primaryColor?: string | null | undefined;
}> = (props) => {
  return (
    <ul className="flex">
      <SingleRatingComponent
        rating={props.rating}
        color={props.primaryColor}
        i={1}
      />
      <SingleRatingComponent
        rating={props.rating}
        color={props.primaryColor}
        i={2}
      />
      <SingleRatingComponent
        rating={props.rating}
        color={props.primaryColor}
        i={3}
      />
      <SingleRatingComponent
        rating={props.rating}
        color={props.primaryColor}
        i={4}
      />
      <SingleRatingComponent
        rating={props.rating}
        color={props.primaryColor}
        i={5}
      />
    </ul>
  )
}

export const SelectRatingComponent: React.FC<{
  rating: number | undefined;
  onRatingChange: (rating: number) => void;
  ratingColor?: string;
}> = (props) => {
  return (
    <div className="mb-4 flex gap-0 items-center">
      <SingleRatingComponent i={1}
        isBig
        rating={props.rating}
        onRatingChange={(i: number) => {
          props.onRatingChange(i);
        }}
        color={props.ratingColor}
      />
      <SingleRatingComponent
        i={2}
        isBig
        rating={props.rating}
        onRatingChange={(i: number) => {
          props.onRatingChange(i);
        }}
        color={props.ratingColor}
      />
      <SingleRatingComponent
        i={3}
        isBig
        rating={props.rating}
        onRatingChange={(i: number) => {
          props.onRatingChange(i);
        }}
        color={props.ratingColor}
      />
      <SingleRatingComponent
        i={4}
        isBig
        rating={props.rating}
        onRatingChange={(i: number) => {
          props.onRatingChange(i);
        }}
        color={props.ratingColor}
      />
      <SingleRatingComponent
        i={5}
        isBig
        rating={props.rating}
        onRatingChange={(i: number) => {
          props.onRatingChange(i);
        }}
        color={props.ratingColor}
      />
    </div>
  )
}

const SingleRatingComponent: React.FC<{
  rating: number | undefined;
  i: number;
  onRatingChange?: (rating: number) => void;
  isBig?: boolean;
  color?: string | null | undefined;
}> = (props) => {
  const active = (props.rating || 0) >= props.i;
  return (
    <a
      className={`
        ${`${active ? 'text-primary' : 'text-gray-400 dark:text-base-content'} select-none`} 
        cursor-pointer ${props.isBig ? 'text-4xl' : ''} self-center
        `
      }
      onClick={() => {
        if (props.onRatingChange) props.onRatingChange(props.i);
      }}
      style={{
        color: active ? props.color || undefined : undefined
      }}
    >
      <AiFillStar />
    </a >
  )
}
//TODO: not put dark:text-current but the color of the text
