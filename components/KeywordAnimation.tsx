import AnimatedWord from './AnimatedWord';

const KeywordAnimation = () => {
  const keywords = [];

  return (
    <div className="w-full mt-16 mb-12 relative px-8">
      <div className="flex relative w-full min-h-[100px]">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className={`absolute ${
              index === 0 ? 'left-0' : 
              index === 1 ? 'left-1/2 -translate-x-1/2' :
              'right-0'
            }`}
          >
            <AnimatedWord
              text={keyword.text}
              gradient={keyword.gradient}
              delay={keyword.delay}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordAnimation;