FROM node:14.18-alpine AS BASE_IMAGE
RUN apk add --no-cache nodejs npm
WORKDIR /nft-details-server
COPY package.json /nft-details-server
COPY yarn.lock /nft-details-server
RUN yarn install
ENV POSTGRES_HOST_ADDRESS="karmaplex-db.c3fswzqpyf9j.us-east-1.rds.amazonaws.com"
ENV POSTGRES_USER_NAME="postgres"
ENV POSTGRES_PASSWORD="Karmaplex2022"
ENV POSTGRES_DATABASE="karmaplex"
ENV S3_ACCESS_KEY="AKIAUIURKTV6DBI3M67L"
ENV S3_SECRET_ACCESS_KEY="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"
ENV S3_REGION="us-east-1"
ENV S3_BUCKET_NAME="launchpad-submission-bucket"
COPY . /nft-details-server

FROM node:14.18-alpine
WORKDIR /app
COPY --from=BASE_IMAGE /nft-details-server /app/
ENV DB_CONN_STRING mongodb+srv://salesadmin:admin@sales-api-db-cluster.kwbdo.mongodb.net/nftdetailsdb?retryWrites=true&w=majority
EXPOSE 9000
CMD [ "npm", "run", "start" ]
