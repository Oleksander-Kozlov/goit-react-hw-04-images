import { Button } from "./Button.styled";

export const BTNLoadMore = ({ newFetchImages }) => {
  return <Button onClick={() => newFetchImages()}>Load More</Button>;
};