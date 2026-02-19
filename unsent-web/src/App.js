import React, { useState, useEffect } from 'react';

// 구글 나눔명조 폰트 적용
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap');
  body { font-family: 'Nanum Myeongjo', serif; }
`;

export default function App() {
  const [step, setStep] = useState('landing');
  // 2. 초기 데이터에 예시 추가
  const [spaces, setSpaces] = useState(() => {
    const saved = localStorage.getItem('unsent_spaces');
    if (saved) return JSON.parse(saved);
    
    // 저장된 데이터가 없을 때만 보여줄 예시 데이터
    return [
      {
        id: 1,
        name: "첫사랑 그 아이",
        letters: ["복도에서 나던 비누 향기가 가끔 생각나.", "너는 지금쯤 어떤 어른이 되었을까?"]
      },
      {
        id: 2,
        name: "3년 전의 나에게",
        letters: ["지금 고민하는 거, 생각보다 별거 아니게 될 거야.", "조금만 더 버텨줘서 고마워."]
      }
    ];
  });
  const [currentSpace, setCurrentSpace] = useState(null);
  const [newNickname, setNewNickname] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    localStorage.setItem('unsent_spaces', JSON.stringify(spaces));
  }, [spaces]);

  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          누군가에게 닿지 않아도 괜찮은<br/>마음들이 있습니다.
        </p>
        <button 
          onClick={() => setStep('list')}
          className="px-8 py-3 border border-slate-300 text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          기록 시작하기
        </button>
      </div>
    );
  }

  if (step === 'list') {
    return (
      <div className="min-h-screen bg-white p-6 max-w-lg mx-auto">
        <h2 className="text-xl text-slate-800 mb-8 font-light">나의 서랍들</h2>
        <div className="grid gap-4 mb-10">
          {spaces.map(s => (
            <div 
              key={s.id} 
              onClick={() => { setCurrentSpace(s); setStep('main'); }}
              className="p-6 border border-slate-100 rounded-2xl bg-slate-50 cursor-pointer hover:border-slate-300 transition"
            >
              <span className="text-slate-600 font-medium">{s.name}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setStep('create')}
          className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition"
        >
          + 새로운 사람 추가
        </button>
      </div>
    );
  }

  if (step === 'create') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <h2 className="text-xl text-slate-700 mb-6">그 사람을 무엇이라 부를까요?</h2>
        <input 
          type="text"
          className="w-full max-w-sm border-b border-slate-300 py-2 text-center focus:outline-none focus:border-slate-800 mb-10"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
        />
        <button 
          onClick={() => {
            if(!newNickname) return;
            const newSpace = { id: Date.now(), name: newNickname, letters: [] };
            setSpaces([...spaces, newSpace]);
            setCurrentSpace(newSpace);
            setNewNickname('');
            setStep('main');
          }}
          className="text-slate-500 hover:text-slate-800 underline underline-offset-4"
        >
          이 이름으로 시작하기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 max-w-lg mx-auto">
      <header className="py-10 text-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest">To. {currentSpace.name}</span>
        <h1 className="text-slate-800 mt-2 font-light text-xl">지금의 나를 남깁니다</h1>
      </header>
      <textarea 
        className="w-full h-64 p-4 bg-slate-50 rounded-xl focus:outline-none text-slate-700 leading-relaxed mb-4 resize-none"
        placeholder="완성하지 않아도 괜찮아요. 단어 하나부터 시작해보세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-between items-center mb-12">
        <button onClick={() => setStep('list')} className="text-slate-400 text-sm">목록으로</button>
        <button 
          onClick={() => {
            if(!content) return;
            const updatedSpaces = spaces.map(s => 
              s.id === currentSpace.id ? { ...s, letters: [content, ...s.letters] } : s
            );
            setSpaces(updatedSpaces);
            setCurrentSpace(updatedSpaces.find(s => s.id === currentSpace.id));
            setContent('');
            alert("마음을 담았습니다.");
          }}
          className="bg-slate-800 text-white px-8 py-2 rounded-full text-sm hover:bg-slate-700 transition"
        >
          남겨두기
        </button>
      </div>
      <div className="space-y-6">
        {currentSpace.letters.map((l, i) => (
          <div key={i} className="text-slate-600 text-sm leading-relaxed border-l-2 border-slate-100 pl-4 py-1 italic">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}