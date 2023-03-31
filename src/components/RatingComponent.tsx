import type { RatingEnum } from "@prisma/client";
import React from "react";

export const RatingComponent: React.FC<{
  rating: RatingEnum;
  editable?: boolean;
}> = (props) => {
  return (
    <div className="rating rating-md">
      <input type="radio" name="rating-1" className="mask mask-star" checked={props.rating === 'ONE'} />
      <input type="radio" name="rating-1" className="mask mask-star" checked={props.rating === 'TWO'} />
      <input type="radio" name="rating-1" className="mask mask-star" checked={props.rating === 'THREE'} />
      <input type="radio" name="rating-1" className="mask mask-star" checked={props.rating === 'FOUR'} />
      <input type="radio" name="rating-1" className="mask mask-star" checked={props.rating === 'FIVE'} />
    </div>
  )
}
