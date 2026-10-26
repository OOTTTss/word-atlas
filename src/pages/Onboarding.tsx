import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAtlas } from "../atlas/context";
import { store } from "../store/store";

export function Onboarding() {
  const atlas = useAtlas();
  const [goal, setGoal] = useState(5);
  const finish = () => store.settings({ onboarded: true, startLevel: 0, dailyNew: goal });
  return (
    <div className="onboard" role="dialog" aria-modal="true" aria-label="欢迎">
      <div className="onboard-card">
        <img className="onboard-art" src={`${import.meta.env.BASE_URL}brand/hero.webp`} alt="" />
        <div className="onboard-body">
          <p className="eyebrow">欢迎来到词光 · 基础词图鉴</p>
          <h1 className="display">
            {atlas.count.toLocaleString()} 颗星，
            <br />
            等你一颗颗点亮。
          </h1>
          <p className="lede">看插画、听发音，再试着想起单词。每天先复习，再认识新朋友。</p>
          <fieldset>
            <legend>每天点亮几颗新星？</legend>
            <div className="segmented segmented-wide">
              {[5, 8, 10].map((n) => (
                <button key={n} className={goal === n ? "is-on" : ""} onClick={() => setGoal(n)} aria-pressed={goal === n}>
                  {n} 个{n === 5 ? " · 从这里开始" : ""}
                </button>
              ))}
            </div>
          </fieldset>
          <button className="btn btn-primary btn-xl" onClick={finish}>
            出发 <ArrowRight size={20} />
          </button>
          <p className="muted">不用登录。进度保存在这台 iPad 的浏览器里，请让家长定期在「我的」里导出备份。</p>
        </div>
      </div>
    </div>
  );
}
