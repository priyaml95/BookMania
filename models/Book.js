class Book {
    constructor(id, title, subtitle, authors, publisher,
        publishedDate, description, pageCount, thumbnail,
        previewLink, infoLink, buyLink, averageRating, ratingsCount) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.authors = authors;
        this.publisher = publisher;
        this.publishedDate = publishedDate;
        this.description = description;
        this.pageCount = pageCount;
        this.thumbnail = thumbnail;
        this.previewLink = previewLink;
        this.infoLink = infoLink;
        this.buyLink = buyLink;
        this.averageRating = averageRating;
        this.ratingsCount = ratingsCount;
    }
};

export default Book;