import { ArrowUpRight, Database, Github, Heart } from "lucide-react";
import { useAtlas } from "../atlas/context";
import { REPO_URL } from "../config";

const BASE = import.meta.env.BASE_URL;

export function About() {
  const atlas = useAtlas();
  return (
    <div className="page about">
      <header className="about-hero">
        <img src={`${BASE}brand/og.webp`} alt="" />
        <div>
          <p className="eyebrow">关于词光</p>
          <h1 className="display">一词一画，每天进步一点。</h1>
          <p className="lede">
            这份家庭版从 Word Atlas 中选出 {atlas.count.toLocaleString()} 个基础词，按生活主题整理，保留插画、英美发音和日常例句。它是通用基础词包，尚未按学校教材编排。
          </p>
          <p className="lede">它免费、开源、无需注册。代码用 MIT，词库用 CC BY 4.0，谁都可以拿去用。</p>
          <div className="about-actions">
            <a className="btn btn-primary" href={REPO_URL} target="_blank" rel="noreferrer">
              <Github size={18} /> 在 GitHub 上查看
            </a>
            <a className="btn btn-ghost" href={`${REPO_URL}/tree/main/data`} target="_blank" rel="noreferrer">
              <Database size={18} /> 下载词库 JSON / CSV
            </a>
          </div>
        </div>
      </header>

      <div className="about-grid">
        <section className="panel">
          <h3 className="eyebrow">为什么记得住</h3>
          <ul className="feature-list">
            <li>
              <b>先看见。</b>每个词都有一幅画，画的就是第一句例句里发生的事。
            </li>
            <li>
              <b>再想起。</b>选义、看图补句、听音辨词、拼写，从认得走到会写。
            </li>
            <li>
              <b>刚好在快忘时重逢。</b>FSRS 是新版 Anki 用的开源记忆算法，只在你快要遗忘时安排复习。
            </li>
            <li>
              <b>分数诚实。</b>只算第一次作答。答错的词会换个题型再见一面，但不会抬高正确率。
            </li>
            <li>
              <b>进度只属于你。</b>没有账号，没有服务器，数据存在你的浏览器里，随时能导出。
            </li>
          </ul>
        </section>

        <section className="panel">
          <h3 className="eyebrow">快捷键</h3>
          <dl className="keys">
            <div>
              <dt>
                <kbd>⌘</kbd>
                <kbd>K</kbd> 或 <kbd>/</kbd>
              </dt>
              <dd>搜索任何词</dd>
            </div>
            <div>
              <dt>
                <kbd>1</kbd>–<kbd>4</kbd>
              </dt>
              <dd>选择答案</dd>
            </div>
            <div>
              <dt>
                <kbd>Enter</kbd>
              </dt>
              <dd>确认 / 继续</dd>
            </div>
            <div>
              <dt>
                <kbd>←</kbd> <kbd>→</kbd>
              </dt>
              <dd>词卡里切换上一个、下一个</dd>
            </div>
            <div>
              <dt>
                <kbd>Esc</kbd>
              </dt>
              <dd>关闭弹窗</dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <h3 className="eyebrow">内容从哪里来</h3>
          <p className="muted">
            释义、例句、搭配和提示由大语言模型按统一的词典规范重新撰写；插画由图像模型按统一画风逐词绘制；发音和朗读由 ElevenLabs 合成（英音 Alice，美音 Sarah）。家庭版筛选了词头与日常例句，并移除了雅思长例句。原素材不是逐条人工审定的教材；遇到不熟悉的用法，请和家长一起核对。
          </p>
          <p className="muted">本项目基于 <a href="https://github.com/designfuchen/word-atlas" target="_blank" rel="noreferrer">designfuchen/word-atlas</a> 修改。Word Atlas contributors — <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>。</p>
        </section>

        <section className="panel">
          <h3 className="eyebrow">给家长</h3>
          <p className="muted">
            家长可在「我的」里导出和恢复学习记录。日常使用不需要任何模型服务密钥；学习内容和音频来自本站已有文件。
          </p>
          <a className="link" href={`${REPO_URL}#readme`} target="_blank" rel="noreferrer">
            查看项目说明 <ArrowUpRight size={14} />
          </a>
        </section>
      </div>
      <p className="colophon">
        <Heart size={14} /> 做给每一个在背单词的人。
      </p>
    </div>
  );
}
