import type { RatingEnum } from "@prisma/client";
import React from "react";

export const RatingComponent: React.FC<{
  rating: RatingEnum;
}> = (props) => {
  return (
    <div className="rating rating-half">
      <SingleRatingComponent checked={props.rating === 'ONE'} />
      <SingleRatingComponent checked={props.rating === 'TWO'} />
      <SingleRatingComponent checked={props.rating === 'THREE'} />
      <SingleRatingComponent checked={props.rating === 'FOUR'} />
      <SingleRatingComponent checked={props.rating === 'FIVE'} />
    </div>
  )
}

const SingleRatingComponent: React.FC<{
  checked: boolean;
}> = (props) => {
  return <input type="radio" name="rating-1" className="mask mask-star" checked={props.checked} />
}
