import type { RatingEnum } from "@prisma/client";
import React from "react";

export const RatingComponent: React.FC<{
  rating: RatingEnum;
  editable?: boolean;
}> = (props) => {
  const [rating, setRating] = React.useState<RatingEnum>(props.rating);
  const onRatingChange = (newRating: RatingEnum) => {
    if (props.editable) {
      console.log("Rating changed to " + newRating)
      setRating(newRating);
    }
  }
  return (
    <div className="rating rating-md">
      <input type="radio" name="rating-1" className="mask mask-star" checked={rating === 'ONE'}
        onClick={() => onRatingChange('ONE')}
        id="rating-1"
      />
      <input type="radio" name="rating-2" className="mask mask-star" checked={rating === 'TWO'}
        onClick={() => onRatingChange('TWO')}
        id="rating-2"
      />
      <input type="radio" name="rating-3" className="mask mask-star" checked={rating === 'THREE'}
        onClick={() => onRatingChange('THREE')}
        id="rating-3"
      />
      <input type="radio" name="rating-4" className="mask mask-star" checked={rating === 'FOUR'}
        onClick={() => onRatingChange('FOUR')}
        id="rating-4"

      />
      <input type="radio" name="rating-5" className="mask mask-star" checked={rating === 'FIVE'}
        onClick={() => onRatingChange('FIVE')}
        id="rating-5"
      />
    </div>
  )
}
