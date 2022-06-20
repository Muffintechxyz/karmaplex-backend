FROM node:14.18-alpine AS BASE_IMAGE
RUN apk add --no-cache nodejs npm
WORKDIR /nft-details-server
COPY package.json /nft-details-server
COPY yarn.lock /nft-details-server
RUN yarn install
# ENV POSTGRES_HOST_ADDRESS=""
# ENV POSTGRES_USER_NAME=""
# ENV POSTGRES_PASSWORD=""
ENV POSTGRES_DATABASE="karmaplex"
# ENV S3_ACCESS_KEY=""
# ENV S3_SECRET_ACCESS_KEY=""
ENV S3_REGION="us-east-1"
ENV S3_BUCKET_NAME="launchpad-submission-bucket"
COPY . /nft-details-server

FROM node:14.18-alpine
WORKDIR /app
COPY --from=BASE_IMAGE /nft-details-server /app/
EXPOSE 9000
CMD [ "npm", "run", "start" ]
