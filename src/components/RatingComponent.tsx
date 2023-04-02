import React from "react";

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
  rating: number;
  onRatingChange: (rating: number) => void;
}> = (props) => {
  return (
    <div className="rating rating-lg items-center justify-center">
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
  rating: number;
  i: number;
  onRatingChange: (rating: number) => void;
}> = (props) => {
  return (
    <input
      type="radio"
      name="rating-3"
      className="mask mask-star bg-primary"
      defaultChecked={props.i === 4}
      onClick={() => {
        props.onRatingChange(props.i);
      }}
    />
  )
}
