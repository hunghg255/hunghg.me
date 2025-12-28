// import { Markdown } from "@/components/markdown";
// import { Prose } from "@/components/ui/typography";
// import { USER } from "@/data/user";
import styles from "./index.module.css";

import { Panel, PanelContent, PanelHeader, PanelTitle } from "../panel";

export function About() {
  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent>
        {/* <Prose>
          <Markdown>{USER.about}</Markdown>
        </Prose> */}
        <div className={styles.aboutMe}>
          <p className="font-mono">
            Hi, my name is <span className={styles.hightLight}>Hung</span>,
            i&apos;m {new Date().getFullYear() - 1997} years old. I got a
            bachelor of Electronics Telecommunication Engineering at Ha Noi
            University of Science and Technology (2015 - 2020). Besides, i am
            really passionate about{" "}
            <span className={styles.hightLight}>Javascript</span> and{" "}
            <span className={styles.hightLight}>Web Development.</span>
          </p>

          <p className="font-mono">
            I started learning web programming in 2018. Before that, I had a
            background in C / C ++ programming so getting access to javascript
            is not difficult. I have been in love with javascript since I did
            not know it, I like it. I searched many different sources to learn
            about this language for example:{" "}
            <span>
              <a href="https://developer.mozilla.org/">Developer mozilla</a>
            </span>
            ,{" "}
            <span>
              <a href="https://github.com/getify/You-Dont-Know-JS">
                You Don&apos;t Know JS
              </a>
            </span>
            .... I also took some online courses like{" "}
            <span>
              <a href="https://www.udemy.com/course/react-the-complete-guide-incl-redux/">
                React The Complete Guide in Redux
              </a>
            </span>
            ...
          </p>

          <p className="font-mono">
            In December 2019, when school was almost done, I decided to do an
            internship at a company to experience what a real environment is
            like. I learned a lot from my boss and colleagues while working.
          </p>
          <p className="font-mono">
            I want to be a good person in the field that I have chosen so I
            tried a lot, worked hard.
          </p>
        </div>
      </PanelContent>
    </Panel>
  );
}
