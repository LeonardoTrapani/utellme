import React from "react";
import {AiFillStar} from "react-icons/ai";

export const StaticRatingComponent: React.FC<{
  rating: number;
}> = (props) => {
  return (
    <ul>
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

const SingleRatingComponent: React.FC<{
  rating: number;
  i: number;
  onClick?: (i: number) => void;
}> = (props) => {
  const active = props.rating >= props.i;
  return (
    <a
      className={`${active ? 'text-primary' : 'text-current'} select-none`}
      onClick={() => {
        if (props.onClick) props.onClick(props.i);
      }}
    >
      &#9733;
    </a >
  )
}

export const SelectRatingComponent: React.FC<{
  rating: number | undefined;
  onRatingChange: (rating: number) => void;
}> = (props) => {
  return (
    <div className="mb-4 flex gap-0 items-center">
      <SingleSelectRatingComponent i={1} rating={props.rating} onRatingChange={(i: number) => {
        props.onRatingChange(i);
      }} />
      <SingleSelectRatingComponent i={2} rating={props.rating} onRatingChange={(i: number) => {
        props.onRatingChange(i);
      }} />
      <SingleSelectRatingComponent i={3} rating={props.rating} onRatingChange={(i: number) => {
        props.onRatingChange(i);
      }} />
      <SingleSelectRatingComponent i={4} rating={props.rating} onRatingChange={(i: number) => {
        props.onRatingChange(i);
      }} />
      <SingleSelectRatingComponent i={5} rating={props.rating} onRatingChange={(i: number) => {
        props.onRatingChange(i);
      }} />
    </div>)
}

const SingleSelectRatingComponent: React.FC<{
  rating: number | undefined;
  i: number;
  onRatingChange: (rating: number) => void;
}> = (props) => {
  const active = (props.rating || 0) >= props.i;
  return (
    <a
      className={`
        ${active ? 'text-primary' : 'text-gray-500'} 
        select-none cursor-pointer text-4xl hover:border-red-600 
        self-center
        `
      }
      onClick={() => {
        props.onRatingChange(props.i);
      }}
    >
      <AiFillStar />
    </a >
  )
}
