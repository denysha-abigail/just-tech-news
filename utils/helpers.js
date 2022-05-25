// exports function that makes a test pass
module.exports = {
    format_date: date => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
            date
        ).getFullYear()}`;
    },
    format_plural: (word, amount) => {
        if (amount !== 1) {
            return `${word}s`;
        }

        return word;
    },
    // not all URLs will end in / routes; sometimes they'll end with a query string, meaning that we'll want to cut things off before the ? character
    // we'll also want to account for URLs with much more after the domain
    // we could write a large switch statement, or a few if-else statements, but luckily, replace() returns the modified string
    format_url: url => {
        return url
            .replace('http://', '')
            .replace('https://', '')
            .replace('www.', '')
            .split('/')[0]
            .split('?')[0];
    },
}


