import React from "react";

export const RatingComponent: React.FC<{
  rating: number;
}> = (props) => {
  return (
    <ul className="">
      <SingleRatingComponent rating={props.rating} i={1} />
      <SingleRatingComponent rating={props.rating} i={2} />
      <SingleRatingComponent rating={props.rating} i={3} />
      <SingleRatingComponent rating={props.rating} i={4} />
      <SingleRatingComponent rating={props.rating} i={5} />
    </ul>
  )
}

const SingleRatingComponent: React.FC<{
  rating: number;
  i: number;
}> = (props) => {
  const active = props.rating >= props.i;
  return (
    <a
      className={`${active ? 'text-primary' : 'text-current'} select-none`}
    >
      &#9733;
    </a >
  )
}
