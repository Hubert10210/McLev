import { Component, input } from '@angular/core';


@Component({
  selector: 'app-vocabularytrainer-page',
  imports: [],
  templateUrl: './vocabularytrainer-page.html',
  styleUrl: './vocabularytrainer-page.css',
})
export class VocabularytrainerPage {

  books: any;
  selectedBook: any;
  chapters: any;
  selectedChapters: any;

  vocabularyrequest: any;


  async ngOnInit() {
    let vocabulary_cont = document.getElementById("vocabulary-cont")!;
    vocabulary_cont.style.display = "none";
    let vocabulary_number = document.createElement("p");
    vocabulary_number.id = "vocabulary_number";
    vocabulary_cont.appendChild(vocabulary_number);
    let vocabulary = document.createElement("h1");
    vocabulary.id = "vocabulary";
    vocabulary_cont.appendChild(vocabulary);
    let principalpartwords_html = document.getElementById("principalpartwords_html")!;
    principalpartwords_html.style.display = "none";
    let germanwords_html = document.getElementById("germanwords_html")!;
    germanwords_html.style.display = "none";
    let next_voc_btn = document.getElementById("vocabulary-next-btn")!;
    next_voc_btn.style.display = "none";
    await this.setup();
  }

  async setup(){
      
    this.books = await this.getBooks();
    let bookSelectCont = document.getElementById("bookselection-cont")!;
    for (let b of this.books){
        let button = document.createElement("button");
        button.id = `book:${b}`;
        button.onclick = () => this.getchapters(b);
        button.innerHTML = b;
        bookSelectCont.appendChild(button);
    }

}

  async getchapters(book: any){
      document.getElementById("bookselection-cont")!.style.display = "none";
      document.getElementById("chapterselection-cont")!.style.display = "flex";
      document.getElementById("back_to_book")!.style.display = "flex";

      this.selectedBook = book;

      const fetchParams = new URLSearchParams({
          book
      });
      
      const response = await fetch(`http://localhost:3000/api/getchapters?${fetchParams.toString()}`,{
        method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      });

      const data = await response.json();
      this.chapters = data.chapters;
      let chapterselection = document.getElementById("chapterselection")!;

      for (let c of this.chapters){
          let line = document.createElement("div");
          line.classList.add("chapterselectline");

          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = `chapter:${c}`;

          let text = document.createElement("label");
          text.innerHTML = c;
          text.htmlFor = `chapter:${c}`;
          
          line.append(checkbox)
          line.appendChild(text);
          chapterselection.appendChild(line);
      }
  }

  async getvoc() {
      document.getElementById("chapterselection-cont")!.style.display = "none";
      this.selectedChapters = [];
      for (let c of this.chapters){
          if ((document.getElementById(`chapter:${c}`) as HTMLInputElement).checked){
              this.selectedChapters.push(c);
          }
      }
      
      const response = await fetch("http://localhost:3000/api/getvoc", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              book: this.selectedBook,
              chapters: this.selectedChapters
          })
      });

      const data = await response.json();
      console.log(data.voc); //TODO: ask vocab
      this.vocabularyrequest = data.voc;
      this.vocabularyRequest(this.vocabularyrequest);
  }

  async getBooks(){
      const response = await fetch("http://localhost:3000/api/getbooks",{
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      });

      const data = await response.json();
      return data.books;
  }

  latinwords: string[] = [];
  principalpartwords: string[] = [];
  germanwords: string[] = [];

  user_pricipalpartwords: string[] = [];
  user_germanwords: string[] = [];

  all_vocab_remove: any[] = [];
  all_vocab: any[] = [];

  vocabularyRequest(vocab: any[]){
    let all_vocab_remove = [];
    for (let b = 0; b < Object.keys(vocab).length; b++){
        for (let v = 0; v < Object.values(vocab)[b].length; v++){
            all_vocab_remove.push(Object.values(vocab)[b][v]);
            console.log(all_vocab_remove);
        }
    }
    this.all_vocab_remove = [...all_vocab_remove];
    this.all_vocab = [...all_vocab_remove];
    this.vocabularyRandom(this.all_vocab);
  }

  vocabularyRandom(all_vocab: any[]){
    this.endnumberOfVocab = this.all_vocab_remove.length;
    let latinwords = [];
    let principalpartwords = [];
    let germanwords = [];
    for (let v = 0; v < all_vocab.length; v++){
        let randomIndex = Math.floor(Math.random() * this.all_vocab_remove.length);

        latinwords.push(this.all_vocab_remove[randomIndex][0]);
        principalpartwords.push(this.all_vocab_remove[randomIndex][1]);
        germanwords.push(this.all_vocab_remove[randomIndex][2]);

        this.all_vocab_remove.splice(randomIndex, 1);
    }
    this.latinwords = latinwords;
    this.principalpartwords = principalpartwords;
    this.germanwords = germanwords;

    let vocabulary_cont = document.getElementById("vocabulary-cont")!;
    vocabulary_cont.style.display = "flex";
    let principalpartwords_html = document.getElementById("principalpartwords_html")!;
    principalpartwords_html.style.display = "flex";
    let germanwords_html = document.getElementById("germanwords_html")!;
    germanwords_html.style.display = "flex";
    let next_voc_btn = document.getElementById("vocabulary-next-btn")!;
    next_voc_btn.style.display = "flex";
    next_voc_btn.style.height = "30px";
    next_voc_btn.style.width = "60px";
    next_voc_btn.style.justifyContent = "center";
    next_voc_btn.style.alignItems = "center";
    this.VocabularyNext();
  }

  numberOfVocab: number = 0;
  endnumberOfVocab: number = 0;

  VocabularyNext(){
    let vocabulary_cont = document.getElementById("vocabulary-cont")!;
    vocabulary_cont.style.display = "flex";
    let vocabulary = document.getElementById("vocabulary")!;
    vocabulary.textContent = "";
    let vocabulary_number = document.getElementById("vocabulary_number")!;
    vocabulary_number.textContent = "Anzahl der übrigen Vokabeln: " + (this.endnumberOfVocab -1);

    vocabulary.textContent = this.latinwords[0 + this.numberOfVocab];
    if (this.numberOfVocab > 0){
        this.user_pricipalpartwords.push((document.getElementById("principalpartwords_html") as HTMLInputElement).value);
        this.user_germanwords.push((document.getElementById("germanwords_html") as HTMLInputElement).value);
        (document.getElementById("principalpartwords_html") as HTMLInputElement).value = "";
        (document.getElementById("germanwords_html") as HTMLInputElement).value = "";
    }
    this.numberOfVocab++;
    this.endnumberOfVocab--;


    if (this.numberOfVocab > this.latinwords.length){
        this.numberOfVocab = 0
        let vocabulary_cont = document.getElementById("vocabulary-cont")!;
        vocabulary_cont.style.display = "none";
        let principalpartwords_html = document.getElementById("principalpartwords_html")!;
        principalpartwords_html.style.display = "none";
        let germanwords_html = document.getElementById("germanwords_html")!;
        germanwords_html.style.display = "none";
        let next_voc_btn = document.getElementById("vocabulary-next-btn")!;
        next_voc_btn.style.display = "none";
        this.EndResult();
    }
  }

  EndResult(){
    let endresult_cont = document.getElementById("endresult-cont")!;
    let result_list = document.createElement("div");
    result_list.id = "result-list";
    result_list.style.display = "flex";
    result_list.style.alignItems = "center";
    result_list.style.flexDirection = "column";
    endresult_cont.appendChild(result_list);
    let headline_endrresult = document.createElement("h1");
    headline_endrresult.textContent = "Kontroliere nun deine Antworten!";
    result_list.appendChild(headline_endrresult);
    let result_list_div = document.createElement("div");
    result_list_div.id = "result-list-div";
    result_list.appendChild(result_list_div);
    if (this.all_vocab.length === 0){
        let rusult_list = document.getElementById("result-list");
        rusult_list?.remove()
        this.bookChoice();
    }
    for (let i = 0; i < this.latinwords.length; i++){
        let result_list_ul = document.createElement("ul");
        result_list_ul.id = "result-list-ul";
        let result_list_li = document.createElement("p");
        let result_list_checkbox = document.createElement("input");
        result_list_checkbox.type = "checkbox";
        result_list_checkbox.id = `${i}`;
        result_list_checkbox.addEventListener("change", () => {this.checkbox_checkt.call(this)});
        result_list_li.appendChild(result_list_checkbox);
        result_list_li.append(`${this.latinwords[i]} - ${this.principalpartwords[i]} - ${this.germanwords[i]} | Deine Antwort: ${this.latinwords[i]} - ${this.user_pricipalpartwords[i]} - ${this.user_germanwords[i]}`);
        result_list_ul.appendChild(result_list_li);
        result_list_div.appendChild(result_list_ul);
    }

    let rusult_list_button = document.createElement("button");
    rusult_list_button.id = "result-list-button";
    rusult_list_button.textContent = "Wiederholen";
    rusult_list_button.onclick = () => this.deleteVocab();
    result_list.appendChild(rusult_list_button);
    this.checkbox_checkt.call(this);
  }

  checkbox_checkt(){
    let all_checked =true;
        for (let i = 0; i < this.latinwords.length; i++){
            if ((document.getElementById(`${i}`) as HTMLInputElement).checked == false){
                all_checked = false;
                break;
            }
        }
    let rusult_list_button = document.getElementById("result-list-button")!;
    if(all_checked){
        rusult_list_button.style.display = "none";
    }
    else{
        rusult_list_button.style.display = "flex";
    }
  }

  deleteVocab(){
    this.all_vocab = []
    for (let i = 0; i < this.latinwords.length; i++){
        if ((document.getElementById(`${i}`) as HTMLInputElement).checked == false){
            this.all_vocab.push([this.latinwords[i], this.principalpartwords[i], this.germanwords[i]])
        }
    }
    let rusult_list = document.getElementById("result-list");
    rusult_list?.remove()
    
    this.numberOfVocab = 0;
    this.endnumberOfVocab = 0;
    this.latinwords = [];
    this.principalpartwords = [];
    this.germanwords = [];

    this.user_pricipalpartwords = [];
    this.user_germanwords = [];

    this.all_vocab_remove = [...this.all_vocab];
    console.log(this.all_vocab);

    this.vocabularyRandom(this.all_vocab);

  }

  back_to_book(){
    document.getElementById("chapterselection-cont")!.style.display = "none";
    document.getElementById("back_to_book")!.style.display = "none";
    let vocabulary_cont = document.getElementById("vocabulary-cont")!;
    vocabulary_cont.style.display = "none";
    let principalpartwords_html = document.getElementById("principalpartwords_html")!;
    principalpartwords_html.style.display = "none";
    let germanwords_html = document.getElementById("germanwords_html")!;
    germanwords_html.style.display = "none";
    let next_voc_btn = document.getElementById("vocabulary-next-btn")!;
    next_voc_btn.style.display = "none";
    let rusult_list = document.getElementById("result-list");
    rusult_list?.remove()
    this.numberOfVocab = 0;
    this.endnumberOfVocab = 0;
    this.bookChoice();
  }

  async bookChoice(){
    this.user_pricipalpartwords = [];
    this.user_germanwords = [];
    document.getElementById("back_to_book")!.style.display = "none";
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            (checkbox as HTMLInputElement).checked = false;
        });
    this.books = await this.getBooks();
    let bookSelectCont = document.getElementById("bookselection-cont")!;
    bookSelectCont.style.display = "flex";
    for (let b of this.books){
        let button = document.getElementById(`book:${b}`)!;
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
    }
    let chapterselection = document.getElementById("chapterselection")!;
    chapterselection.innerHTML = "";
  }

}