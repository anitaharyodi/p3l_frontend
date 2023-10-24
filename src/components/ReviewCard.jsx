import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";
import { AiFillStar } from "react-icons/ai";

const ReviewCard = ({ name, rating, review }) => {
  return (
    <Card className="max-w-[440px] h-full p-5 bg-gray-100 shadow-none">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center">
          <h4 className="text-small font-semibold leading-none text-default-600">
            {name}
          </h4>
        </div>
        <div className="flex items-center">
          <AiFillStar className="text-orange-400 text-xl" />
          <span className="text-small ml-1">{rating}</span>
        </div>
      </CardHeader>

      <CardBody className="px-3 py-0 text-small text-default-400 flex items-center">
        <p>{review}</p>
      </CardBody>
    </Card>
  );
};

export default ReviewCard;
