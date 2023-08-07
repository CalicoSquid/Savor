

export default function parseInstruct(string) {
    console.log("Parsing data")
    const listItemRegex = /<li>(.*?)<\/li>/g;
    const listItems = [];
    let match;
    while ((match = listItemRegex.exec(string)) !== null) {
    const listItemText = match[1].trim();
    listItems.push({text: listItemText});
    }
    return listItems;
  }