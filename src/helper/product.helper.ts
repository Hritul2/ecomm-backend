// Function to calculate average rating
export const calculateAvgRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.Rating, 0);
    return sum / reviews.length;
};
