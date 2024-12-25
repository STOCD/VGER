FROM node:lts-alpine AS builder

COPY ./ /tempfolder
WORKDIR /tempfolder
RUN npm install
RUN npm run build

FROM node:lts-alpine

COPY --from=builder /tempfolder/build /build
COPY --from=builder /tempfolder/package.json /package.json
WORKDIR /
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "build/index.js"]
